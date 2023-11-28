import { Router } from "express";
import { addCart } from "../controllers/cart";
import authentication from "../middlewares/authentication";

export default Router().use(authentication).post("/:productId", addCart);
