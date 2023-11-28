import type { Request, Response, NextFunction } from "express";
import { Cart, Product } from "../models";
import AppError from "../middlewares/error";
import {
  statusConflict,
  statusDataNotFound,
  statusUnauthorized,
} from "../constant";
import { v4 } from "uuid";
import createResponse from "../middlewares/response";

export const addCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { UUID } = req.user;

    if (!(await Product.findOne({ where: { UUID: productId } })))
      throw new AppError(statusDataNotFound);

    if (await Cart.findOne({ where: { userId: UUID, productId } }))
      throw new AppError(statusConflict);

    await Cart.create({
      productId,
      userId: UUID,
      UUID: v4(),
    });

    createResponse({ res, code: 201, message: "success" });
  } catch (err) {
    next(err);
  }
};

export const deleteCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId } = req.params;
    const { UUID } = req.user;

    if (!(await Cart.findOne({ where: { productId, userId: UUID } })))
      throw new AppError(statusDataNotFound);

    await Cart.destroy({ where: { productId, userId: UUID } });

    createResponse({ res, code: 200, message: "success" });
  } catch (err) {
    next(err);
  }
};

export const getMyCart = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { UUID } = req.user;

    const { rows: data, count: totalData } = await Cart.findAndCountAll({
      where: { userId: UUID },
      order: [["createdAt", "DESC"]],
      offset: (page - 1) * limit,
      limit,
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
