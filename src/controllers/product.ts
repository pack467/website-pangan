import type { Request, Response, NextFunction } from "express";
import {
  createProductImgValidate,
  createProductValidate,
  updateProductValidate,
} from "../validator/product";
import createResponse from "../middlewares/response";
import { Db, Product, ProductImg, ProductType } from "../models";
import AppError from "../middlewares/error";
import { statusConflict, statusDataNotFound } from "../constant";
import { bulkUploadImg } from "../lib/imagekit";
import { readdirSync, unlinkSync, readFileSync } from "fs";
import { v4 } from "uuid";

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
