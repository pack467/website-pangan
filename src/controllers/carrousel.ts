import {
  type Request,
  type Response,
  type NextFunction,
  response,
} from "express";
import { createCarouselValidate } from "../validator/carousel";
import { Carousel, Product, ProductImg } from "../models";
import AppError from "../middlewares/error";
import { statusConflict, statusDataNotFound } from "../constant";
import createResponse from "../middlewares/response";
import { ProductImgAttributes } from "../interfaces/productImg";
import { ProductAttributes } from "../interfaces/product";

export const addCarousel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { imageId } = await createCarouselValidate(req.body);

    const img = (await ProductImg.findOne({
      where: { imageId },
      include: [{ model: Product }],
    })) as (ProductImgAttributes & { Product: ProductAttributes }) | null;
    if (!img) throw new AppError(statusDataNotFound);

    if (
      await Carousel.findOne({
        where: { imageId, productId: img.Product.UUID },
      })
    )
      throw new AppError(statusConflict);

    await Carousel.create({
      productId: img.Product.UUID,
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
  next: NextFunction,
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

export const getCarousel = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    createResponse({
      res,
      code: 200,
      data: await Carousel.findAll({
        include: [{ model: Product, include: [{ model: ProductImg }] }],
      }),
    });
  } catch (err) {
    next(err);
  }
};
