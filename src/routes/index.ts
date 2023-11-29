import { Router } from "express";
import authRoute from "./auth";
import productRoute from "./product";
import productTypeRoute from "./productType";
import cartRoute from "./cart";
import walletRoute from "./wallet";

export default Router()
  .use("/auth", authRoute)
  .use("/product-type", productTypeRoute)
  .use("/product", productRoute)
  .use("/wallet", walletRoute)
  .use("/cart", cartRoute);
