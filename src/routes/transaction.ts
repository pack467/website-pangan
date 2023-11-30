import { Router } from "express";
import authentication from "../middlewares/authentication";
import userAuthorize from "../middlewares/userAuthorize";
import { getMyTransaction } from "../controllers/transaction";

export default Router()
  .use(authentication)
  .get("/me", userAuthorize, getMyTransaction);
