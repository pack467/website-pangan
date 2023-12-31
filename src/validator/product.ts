import * as yup from "yup";
import validate, { imageValidator } from ".";
import type {
  CreateProductInput,
  PurchaseProductValidate,
} from "../interfaces/product";
import type { MulterFile } from "../interfaces";
import { Product } from "../models";
import { Bank } from "../interfaces/wallet";

export const createProductValidate = async (data: any) =>
  await validate<CreateProductInput>(
    yup.object().shape({
      name: yup.string().required("name is required"),
      price: yup.number().required("price is required"),
      desc: yup.string().default(""),
      stock: yup.number().required("stock is required"),
      typeId: yup.string().required("typeId is requireds"),
    }),
    data
  );

export const updateProductValidate = async (data: any, product: Product) =>
  await validate<
    CreateProductInput & { status: "available" | "not available" | "preorder" }
  >(
    yup.object().shape({
      name: yup.string().default(product.name),
      price: yup.number().default(product.price),
      desc: yup.string().default(product.desc),
      stock: yup.number().default(product.stock),
      typeId: yup.string().default(product.typeId),
      status: yup
        .string()
        .default(product.status)
        .oneOf(["available", "not available", "preorder"], "invalid status"),
    }),
    data
  );

export const createProductImgValidate = async (data: any) =>
  await validate<MulterFile[]>(
    yup
      .array()
      .of(yup.object(imageValidator))
      .min(1, "At least one image is required")
      .max(4, "4 images is the limit"),
    data
  );

const buyItemValidation = {
  items: yup
    .array()
    .of(
      yup.object({
        itemId: yup.string().required("please input items id"),
        total: yup.number().default(1),
      })
    )
    .min(1, "input atleast 1 item"),
};

export const buyProductValidate = async (data: any) =>
  await validate<PurchaseProductValidate>(
    yup.object().shape(buyItemValidation),
    data
  );

export const buyProductByVaValidate = async (data: any) =>
  await validate<PurchaseProductValidate & { bank: Bank }>(
    yup.object().shape({
      ...buyItemValidation,
      bank: yup
        .string()
        .required("bank is required")
        .oneOf(
          ["BCA", "BNI", "PERMATA", "BRI"],
          "invalid bank/bank is not provided"
        ),
    }),
    data
  );
