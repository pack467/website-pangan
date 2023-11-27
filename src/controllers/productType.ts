import type { Request, Response, NextFunction } from "express";
import { validateCreateType } from "../validator/productTypes";
import { ProductType } from "../models";
import { v4 } from "uuid";
import createResponse from "../middlewares/response";
import AppError from "../middlewares/error";
import { statusDataNotFound } from "../constant";

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

export const getAllProductTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const { rows: data, count: totalData } = await ProductType.findAndCountAll({
      limit,
      offset: (page - 1) * limit,
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
