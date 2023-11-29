import { Router } from "express";
import {
  buyProductsByWallet,
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
} from "../controllers/product";
import authentication from "../middlewares/authentication";
import adminAuthorize from "../middlewares/adminAuthorize";
import multer from "../middlewares/multer";
import userAuthorize from "../middlewares/userAuthorize";

export default Router()
  .use(authentication)
  .get("/", getAllProduct)
  .post("/", multer.array("productImg", 4), adminAuthorize, createProduct)
  .post("/wallet", userAuthorize, buyProductsByWallet)
  .get("/:UUID", getProductById)
  .put("/:UUID", adminAuthorize, updateProduct);
