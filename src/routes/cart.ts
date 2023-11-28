import { Router } from "express";
import { addCart, deleteCart } from "../controllers/cart";
import authentication from "../middlewares/authentication";
import userAuthorize from "../middlewares/userAuthorize";

export default Router()
  .use(authentication)
  .use(userAuthorize)
  .post("/:productId", addCart)
  .delete("/:productId", deleteCart);
