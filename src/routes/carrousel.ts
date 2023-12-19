import { Router } from "express";
import adminAuthorize from "../middlewares/adminAuthorize";
import authentication from "../middlewares/authentication";
import {
  addCarousel,
  deleteCarousel,
  getCarousel,
} from "../controllers/carrousel";

export default Router()
  .use(authentication)
  .get("/", getCarousel)
  .use(adminAuthorize)
  .post("/", addCarousel)
  .delete("/:productId/:imageId", deleteCarousel);
