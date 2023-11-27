import type { Request, Response, NextFunction } from "express";
import { validateCreateType } from "../validator/productTypes";
import { ProductType } from "../models";
import { v4 } from "uuid";
import createResponse from "../middlewares/response";

export const addProductTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { type } = await validateCreateType(req.body);
    const { UUID } = req.user;

    await ProductType.create({
      type,
      createdBy: UUID,
      UUID: v4(),
    });

    createResponse({ res, code: 201, message: "success" });
  } catch (err) {
    next(err);
  }
};
