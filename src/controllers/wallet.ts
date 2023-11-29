import type { Request, Response, NextFunction } from "express";
import { topupValidator } from "../validator/wallet";
import { GenerateBankTransaction } from "../helpers/transaction";
import type { UserAttributes } from "../interfaces/user";
import core from "../lib/midtrans";
import { sha512 } from "js-sha512";
import { Transaction } from "../models";
import createResponse from "../middlewares/response";

export const Topup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { UUID, username, email } = req.user as UserAttributes;
    const payload = new GenerateBankTransaction({
      ...(await topupValidator(req.body)),
      UUID,
      username,
      email,
    });

    const data = await core.charge(payload.bodyRequest());

    const signature = sha512(
      data.order_id +
        "200" +
        data.gross_amount +
        process.env.MIDTRANS_SERVER_KEY
    );

    await Transaction.create({
      userId: UUID,
      type: "Top up",
      status: "Pending",
      amount: Number(data.gross_amount),
      signature,
    });

    createResponse({
      res,
      code: 201,
      message: "OK",
      data,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
