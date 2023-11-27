import * as yup from "yup";
import validate, { imageValidator } from ".";
import type { CreateProductInput } from "../interfaces/product";
import type { MulterFile } from "../interfaces";

export const createProductValidate = async (data: any) =>
  await validate<CreateProductInput>(
    yup.object().shape({
      name: yup.string().required("name is required"),
      price: yup.number().required("price is required"),
      desc: yup.string().default(""),
      stock: yup.number().required("stock is required"),
      typeId:yup.string().required("typeId is requireds")
    }),
    data
  );

export const createProductImgValidate = async (data: any) =>
  await validate<MulterFile[]>(
    yup.object({
      productImg: yup
        .array()
        .of(yup.object(imageValidator))
        .min(1, "At least one image is required")
        .max(4, "4 images is the limit")
        .required(),
    }),
    data
  );
