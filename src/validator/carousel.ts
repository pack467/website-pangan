import * as yup from "yup";
import validate from ".";
import type { AddCarouselInput } from "../interfaces/carousel";

export const createCarouselValidate = async (data: any) =>
  await validate<AddCarouselInput>(
    yup.object().shape({
      imageId: yup.string().required("imageId is required"),
    }),
    data
  );
