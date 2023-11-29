import { Router } from "express";
import authentication from "../middlewares/authentication";
import userAuthorize from "../middlewares/userAuthorize";
import { Topup, paymentNotif } from "../controllers/wallet";
import VerifySignature from "../middlewares/verifyPaymentSignature";

export default Router()
  .post("/notification", VerifySignature, paymentNotif)
  .use(authentication)
  .use(userAuthorize)
  .post("/topup", Topup);
