import type { Request, Response, NextFunction } from "express";
import {
  loginValidator,
  userRegisterValidator,
  adminRegisterValidator,
} from "../validator/auth";
import { User, Admin, Token, Db, Wallet } from "../models";
import AppError from "../middlewares/error";
import { compareHash } from "../helpers/encryption";
import { createToken } from "../helpers/jwt";
import createResponse from "../middlewares/response";
import { v4 } from "uuid";

export const loginHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, as } = await loginValidator(req.body);

    let account: User | Admin | null | undefined;
    switch (as) {
      case "User":
        account = await User.findOne({ where: { email } });
        break;
      case "Admin":
        account = await Admin.findOne({ where: { email } });
        break;
    }

    if (!account || !compareHash(password, account.password))
      throw new AppError({
        statusCode: 401,
        message: "invalid credentials",
      });

    const access_token = createToken({ UUID: account.UUID, loggedAs: as });

    await Token.create({
      access_token,
      as,
      [as === "User" ? "userId" : "adminId"]: account.UUID,
    });

    createResponse({ res, code: 200, data: access_token });
  } catch (err) {
    next(err);
  }
};

export const userRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await Db.transaction();
  try {
    const { username, email, password } = await userRegisterValidator(req.body);

    const { UUID } = await User.create(
      {
        username,
        email,
        password,
        UUID: v4(),
      },
      { transaction }
    ); //validasi dilakuin sama sequelize

    await Wallet.create(
      {
        userId: UUID,
        balance: 0,
        UUID: v4(),
      },
      { transaction }
    );

    await transaction.commit();
    createResponse({ res, code: 201, message: "success register" });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

export const adminRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = await adminRegisterValidator(req.body);

    await Admin.create({
      name,
      email,
      password,
      UUID: v4(),
    });

    createResponse({ res, code: 201, message: "success register" });
  } catch (err) {
    next(err);
  }
};
