import type { NextFunction, Request, Response } from "express";
import AppError from "./error";
import { Transaction } from "../models";
import { statusForbidden } from "../constant";

export default async function VerifySignature(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { signature_key } = req.body;

    const transaction = await Transaction.findOne({
      where: { signature: signature_key },
    });
    if (!transaction) throw new AppError(statusForbidden);

    req.transaction = transaction;

    next();
  } catch (err) {
    next(err);
  }
}
