import { Router } from "express";
import adminAuthorize from "../middlewares/adminAuthorize";
import authentication from "../middlewares/authentication";
import { addCarousel, deleteCarousel } from "../controllers/carrousel";

export default Router()
  .use(authentication)
  .use(adminAuthorize)
  .post("/", addCarousel)
  .delete("/:productId/:imageId", deleteCarousel);
