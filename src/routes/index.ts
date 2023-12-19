import { Router } from "express";
import authRoute from "./auth";
import productRoute from "./product";
import productTypeRoute from "./productType";
import cartRoute from "./cart";
import walletRoute from "./wallet";
import transactionRoute from "./transaction";
import carrouselRoute from "./carrousel";

export default Router()
  .use("/auth", authRoute)
  .use("/product-type", productTypeRoute)
  .use("/product", productRoute)
  .use("/wallet", walletRoute)
  .use("/cart", cartRoute)
  .use("/transaction", transactionRoute)
  .use("/carrousel", carrouselRoute);
