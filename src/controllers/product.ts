import type { Request, Response, NextFunction } from "express";
import {
  createProductImgValidate,
  createProductValidate,
} from "../validator/product";
import createResponse from "../middlewares/response";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, stock, desc, price, typeId } = await createProductValidate(
      req.body
    );
    const files = await createProductImgValidate(req.files);
    const { UUID } = req.user;

    createResponse({ res, code: 201, message: "success" });
  } catch (err) {
    next(err);
  }
};
