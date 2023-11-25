import type { NextFunction, Request, Response } from "express";
import AppError from "./error";

export default function notFoundRoutes(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  next(
    new AppError({
      message: `Cannot ${req.method} ${req.originalUrl}`,
      statusCode: 404,
    })
  );
}
