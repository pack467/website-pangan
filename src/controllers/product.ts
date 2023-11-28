import type { Request, Response, NextFunction } from "express";
import {
  createProductImgValidate,
  createProductValidate,
} from "../validator/product";
import createResponse from "../middlewares/response";
import { Product } from "../models";
import AppError from "../middlewares/error";
import { statusConflict } from "../constant";
import { bulkUploadImg } from "../lib/imagekit";
import { readdirSync } from "fs";
import path from "path";

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

    const uploads = await bulkUploadImg(
      files.map((el) => ({
        fileName: el,
        folder: "products",
        path: `${dirr}/${files}`,
      }))
    );

    createResponse({
      res,
      code: 201,
      message: "success",
      data: files,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
