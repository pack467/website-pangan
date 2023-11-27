import { Router } from "express";
import authRoute from "./auth";
import productRoute from "./product";
import productTypeRoute from "./productType";

export default Router()
  .use("/auth", authRoute)
  .use("/product-type", productTypeRoute)
  .use("/product", productRoute);
