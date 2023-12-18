import type { NextFunction, Request, Response } from "express";
import AppError from "./error";
import { statusBadRequest } from "../constant";

export default function formDataOnly(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const contentType = req.headers["content-type"];
    if (
      !contentType ||
      !contentType.toLowerCase().includes("multipart/form-data")
    )
      throw new AppError(
        statusBadRequest("only multipart/form-data is accepted")
      );

    next();
  } catch (err) {
    next(err);
  }
}
