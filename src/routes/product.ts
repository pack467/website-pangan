import { Router } from "express";
import {
  createProduct,
  getAllProduct,
  updateProduct,
} from "../controllers/product";
import authentication from "../middlewares/authentication";
import adminAuthorize from "../middlewares/adminAuthorize";
import multer from "../middlewares/multer";

export default Router()
  .use(authentication)
  .get("/", getAllProduct)
  .post("/", multer.array("productImg", 4), adminAuthorize, createProduct)
  .put("/:UUID", adminAuthorize, updateProduct);
