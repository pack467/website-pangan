import { Router } from "express";
import authRoute from "./auth";

export default Router().use("/auth", authRoute);
