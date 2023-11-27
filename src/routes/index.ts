import { Router } from "express";
import authRoute from "./auth";
import productRoute from "./product";

export default Router()
  .use("/auth", authRoute)
  .use("/product", productRoute);
