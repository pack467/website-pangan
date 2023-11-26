import type { NextFunction, Request, Response } from "express";
import AppError from "./error";
import { statusForbidden } from "../constant";

export default function adminAuthorize(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (req.loggedAs !== "Admin") throw new AppError(statusForbidden);

    next();
  } catch (err) {
    next(err);
  }
}
