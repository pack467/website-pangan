import { Router } from "express";
import { addCart, deleteCart, getMyCart } from "../controllers/cart";
import authentication from "../middlewares/authentication";
import userAuthorize from "../middlewares/userAuthorize";

export default Router()
  .use(authentication)
  .use(userAuthorize)
  .get("/", getMyCart)
  .post("/:productId", addCart)
  .delete("/:productId", deleteCart);
