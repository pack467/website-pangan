import type { Request, Response, NextFunction } from "express";
import { Cart, Product } from "../models";
import AppError from "../middlewares/error";
import { statusConflict, statusDataNotFound } from "../constant";
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
