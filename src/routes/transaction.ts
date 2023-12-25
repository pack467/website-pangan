import { Router } from "express";
import authentication from "../middlewares/authentication";
import userAuthorize from "../middlewares/userAuthorize";
import {
  getAllTransaction,
  getMyTransaction,
  getProcessedTransaction,
  getTransactionById,
} from "../controllers/transaction";
import adminAuthorize from "../middlewares/adminAuthorize";

export default Router()
  .use(authentication)
  .get("/", adminAuthorize, getAllTransaction)
  .use(userAuthorize)
  .get("/me", getMyTransaction)
  .get("/process/:signature", getProcessedTransaction)
  .get("/:transactionId", getTransactionById);
