import * as yup from "yup";
import validate, { imageValidator } from ".";
import type { AddCarouselInput } from "../interfaces/carousel";

export const createCarouselValidate = async (data: any) =>
  await validate<AddCarouselInput>(
    yup.object().shape({
      productId: yup.string().required("productId is required"),
      imageId: yup.string().required("imageId is required"),
    }),
    data
  );
