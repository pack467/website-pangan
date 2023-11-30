import { Router } from "express";
import authentication from "../middlewares/authentication";
import userAuthorize from "../middlewares/userAuthorize";
import { Topup, getMyWallet, paymentNotif } from "../controllers/wallet";
import VerifySignature from "../middlewares/verifyPaymentSignature";

export default Router()
  .post("/notification", VerifySignature, paymentNotif)
  .use(authentication)
  .use(userAuthorize)
  .get("/me", getMyWallet)
  .post("/topup", Topup);
