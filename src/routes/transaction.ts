import { Router } from "express";
import authentication from "../middlewares/authentication";
import userAuthorize from "../middlewares/userAuthorize";
import {
  getAllTransaction,
  getMyTransaction,
} from "../controllers/transaction";
import adminAuthorize from "../middlewares/adminAuthorize";

export default Router()
  .use(authentication)
  .get("/", adminAuthorize, getAllTransaction)
  .get("/me", userAuthorize, getMyTransaction);
