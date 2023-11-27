import { Router } from "express";
import { createProduct } from "../controllers/product";
import authentication from "../middlewares/authentication";
import adminAuthorize from "../middlewares/adminAuthorize";

export default Router()
  .use(authentication)
  .use(adminAuthorize)
  .post("/", createProduct);
