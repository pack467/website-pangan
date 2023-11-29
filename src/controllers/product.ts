import type { Request, Response, NextFunction } from "express";
import {
  buyProductValidate,
  createProductImgValidate,
  createProductValidate,
  updateProductValidate,
} from "../validator/product";
import createResponse from "../middlewares/response";
import {
  Db,
  Product,
  ProductImg,
  ProductType,
  Transaction,
  Wallet,
} from "../models";
import AppError from "../middlewares/error";
import { statusConflict, statusDataNotFound } from "../constant";
import { bulkUploadImg } from "../lib/imagekit";
import { readdirSync, unlinkSync, readFileSync } from "fs";
import { v4 } from "uuid";
import { Op } from "sequelize";
import type { PurchaseProduct } from "../interfaces/product";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await Db.transaction(); //@see https://en.wikipedia.org/wiki/Database_transaction
  try {
    const { name, stock, desc, price, typeId } = await createProductValidate(
      req.body
    );
    await createProductImgValidate(req.files);
    const { UUID } = req.user;

    if (await Product.findOne({ where: { name } }))
      throw new AppError(statusConflict); // <- check udh ada product dengan nama yang sama

    const dirr = "./uploads";
    const files = readdirSync(dirr).map((file) => file);

    const product = await Product.create(
      {
        name,
        stock,
        desc,
        price,
        createdBy: UUID,
        typeId,
        UUID: v4(),
      },
      { transaction }
    );

    const uploads = await bulkUploadImg(
      files.map((el) => ({
        fileName: el,
        folder: "products",
        path: readFileSync(`${dirr}/${el}`),
      }))
    );

    await ProductImg.bulkCreate(
      uploads.map(({ url, fileId }) => ({
        productId: product.UUID,
        imageUrl: url,
        imageId: fileId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
      { transaction }
    );

    files.forEach((el) => {
      unlinkSync(`${dirr}/${el}`);
    });

    await transaction.commit();
    createResponse({
      res,
      code: 201,
      message: "success",
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { UUID } = req.params;

    const product = await Product.findOne({ where: { UUID } });
    if (!product) throw new AppError(statusDataNotFound);

    const {
      name,
      stock,
      desc,
      price,
      typeId,
      status,
    } = await updateProductValidate(req.body, product);

    if (
      typeId !== product.typeId &&
      !(await ProductType.findOne({ where: { UUID: typeId } }))
    )
      throw new AppError(statusDataNotFound);

    await Product.update(
      {
        name,
        stock,
        desc,
        price,
        status,
        typeId,
      },
      { where: { UUID } }
    );

    createResponse({
      res,
      code: 200,
      message: "success",
    });
  } catch (err) {
    next(err);
  }
};

export const getAllProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { sorting = "createdAt", sort } = req.query as Record<string, string>;

    const { rows: data, count: totalData } = await Product.findAndCountAll({
      offset: (page - 1) * limit,
      limit,
      order: [
        [
          ["createdat", "price", "name"].includes(sorting.toLowerCase())
            ? sorting
            : "createdAt",
          ["ASC", "DESC"].includes(sort.toUpperCase()) ? sort : "DESC",
        ],
      ],
    });

    if (!data.length) throw new AppError(statusDataNotFound);

    createResponse(
      { res, code: 200, message: "OK", data },
      {
        page,
        limit,
        totalData,
        totalPage: Math.ceil(totalData / limit),
      }
    );
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { UUID } = req.params;

    const data = await Product.findOne({ where: { UUID } });
    if (!data) throw new AppError(statusDataNotFound);

    createResponse({ res, code: 200, message: "OK", data });
  } catch (err) {
    next(err);
  }
};

export const buyProductsByWallet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await Db.transaction();
  try {
    const { UUID } = req.user;
    const { items } = await buyProductValidate(req.body);

    const products = await Product.findAll({
      where: {
        UUID: {
          [Op.in]: items.map((item) => item.itemId),
        },
      },
      lock: transaction.LOCK.UPDATE,
    });

    if (!products.length) throw new AppError(statusDataNotFound);

    const notFoundData: string[] = [];
    for (const item of items)
      if (!products.map((el) => el.UUID).includes(item.itemId))
        notFoundData.push(item.itemId);

    if (notFoundData.length)
      throw new AppError({ ...statusDataNotFound, data: notFoundData });

    const outOfStock: string[] = [];
    for (const product of products)
      for (const item of items)
        if (item.itemId === product.UUID && product.stock < item.total)
          outOfStock.push(item.itemId);

    if (outOfStock.length)
      throw new AppError({
        statusCode: 400,
        message: "data out of stock",
        data: outOfStock,
      });

    const wallet = await Wallet.findOne({
      where: { userId: UUID },
      lock: transaction.LOCK.UPDATE,
    });

    if (!wallet)
      throw new AppError({ message: "wallet not found", statusCode: 404 });

    const totalPrice = products
      .map(
        ({ price, UUID }) =>
          (items.find((el) => el.itemId === UUID) as PurchaseProduct).total *
          price
      )
      .reduce((prev, curr) => prev + curr);

    if (wallet.balance < totalPrice)
      throw new AppError({
        statusCode: 400,
        message: "your balance is less than the transaction value",
      });

    await Transaction.create(
      {
        userId: UUID,
        type: "Payment",
        status: "Success",
        amount: totalPrice,
        UUID: v4(),
        signature: "created by application",
      },
      { transaction }
    );

    await Wallet.update(
      { balance: wallet.balance - totalPrice },
      { where: { userId: UUID }, transaction }
    );

    await Promise.all(
      items.map(async (item) => {
        const product = products.find(
          (el) => el.UUID === item.itemId
        ) as Product;
        const newStock = product.stock - item.total;
        const update: any = { stock: newStock };

        if (newStock === 0) update.status = "not available";

        return await Product.update(update, {
          where: { UUID: item.itemId },
          transaction,
        });
      })
    );

    await transaction.commit();
    createResponse({ res, code: 201, message: "success" });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};
