import { Router } from "express";
import { adminRegister, loginHandler, userRegister } from "../controllers/auth";
import adminAuthorize from "../middlewares/adminAuthorize";
import authentication from "../middlewares/authentication";

export default Router()
  .post("/login", loginHandler)
  .post("/register/user", userRegister)
  .post("/register/admin", authentication, adminAuthorize, adminRegister);
