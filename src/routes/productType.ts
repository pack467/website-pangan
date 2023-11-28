import { Router } from "express";
import authentication from "../middlewares/authentication";
import adminAuthorize from "../middlewares/adminAuthorize";
import {
  addProductTypes,
  deleteProductType,
  getAllProductTypes,
} from "../controllers/productType";

export default Router()
  .use(authentication)
  .get("/", getAllProductTypes)
  .use(adminAuthorize)
  .post("/", addProductTypes)
  .delete("/:typeId", deleteProductType);
