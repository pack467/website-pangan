import { Router } from "express";
import { createProduct } from "../controllers/product";
import authentication from "../middlewares/authentication";
import adminAuthorize from "../middlewares/adminAuthorize";
import {
  deleteProductType,
  getAllProductTypes,
} from "../controllers/productType";

export default Router()
  .use(authentication)
  .get("/", getAllProductTypes)
  .use(adminAuthorize)
  .post("/", createProduct)
  .delete("/:typeId", deleteProductType);
