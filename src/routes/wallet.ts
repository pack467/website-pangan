import { Router } from "express";
import authentication from "../middlewares/authentication";
import userAuthorize from "../middlewares/userAuthorize";
import { Topup } from "../controllers/wallet";

export default Router()
  .use(authentication)
  .use(userAuthorize)
  .post("/topup", Topup);
