import { Router } from "express";
import { loginHandler } from "../controllers/auth";

export default Router().post("/login", loginHandler);
