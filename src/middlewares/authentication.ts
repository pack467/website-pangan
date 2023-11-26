import type { NextFunction, Request, Response } from "express";
import AppError from "./error";
import { statusInvalidToken } from "../constant";
import { verifyToken } from "../helpers/jwt";
import { Admin, User } from "../models";

export default async function authentication(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { access_token } = req.headers as Record<string, string>;
    if (!access_token) throw new AppError(statusInvalidToken);

    const { UUID, loggedAs } = verifyToken(access_token);

    let account: User | Admin | null = null;
    switch (loggedAs) {
      case "User":
        account = await User.findOne({ where: { UUID } });
        break;
      case "Admin":
        account = await Admin.findOne({ where: { UUID } });
        break;
      default:
        throw new AppError(statusInvalidToken);
    }

    if (!account) throw new AppError(statusInvalidToken);

    req.user = account;
    req.loggedAs = loggedAs;

    next();
  } catch (err) {
    next(err);
  }
}
