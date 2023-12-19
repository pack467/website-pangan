import type { Request, Response, NextFunction } from "express";
import { createCarouselValidate } from "../validator/carousel";
import { Carousel, Product, ProductImg } from "../models";
import AppError from "../middlewares/error";
import { statusConflict, statusDataNotFound } from "../constant";
import createResponse from "../middlewares/response";

export const addCarousel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { productId, imageId } = await createCarouselValidate(req.body);

    if (!(await Product.findOne({ where: { UUID: productId } })))
      throw new AppError({ message: "product not found", statusCode: 404 });

    if (!(await ProductImg.findOne({ where: { imageId } })))
      throw new AppError({ message: "product img not found", statusCode: 404 });

    if (await Carousel.findOne({ where: { productId, imageId } }))
      throw new AppError(statusConflict);

    await Carousel.create({
      productId,
      imageId,
    });

    createResponse({ res, code: 201, message: "success" });
  } catch (err) {
    next(err);
  }
};

export const deleteCarousel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { imageId, productId } = req.params;

    if (!(await Carousel.findOne({ where: { imageId, productId } })))
      throw new AppError(statusDataNotFound);

    await Carousel.destroy({ where: { productId, imageId } });

    createResponse({ res, code: 200, message: "success" });
  } catch (err) {
    next(err);
  }
};
