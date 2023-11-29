import type { Request, Response, NextFunction } from "express";
import { topupValidator } from "../validator/wallet";
import { GenerateBankTransaction } from "../helpers/transaction";
import type { UserAttributes } from "../interfaces/user";
import core from "../lib/midtrans";
import { sha512 } from "js-sha512";
import { Db, Transaction, User, Wallet } from "../models";
import createResponse from "../middlewares/response";
import AppError from "../middlewares/error";
import { TransactionStatus } from "../interfaces/transaction";

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

export const paymentNotif = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const transaction = await Db.transaction();
  try {
    const data = await core.transaction.notification(req.body);

    const [_, id, t, type] = data.order_id.split("-");
    const { transaction_status, signature_key, gross_amount } = data;

    const UUID = id.replace(/\./g, "-");
    const isCancel = transaction_status === "cancel";
    const isDeny = transaction_status === "deny";
    const isExpire = transaction_status === "expire";

    switch (true) {
      case transaction_status === "settlement": {
        if (
          !(await User.findOne({
            where: { UUID },
          }))
        )
          throw new AppError({ statusCode: 404, message: "user not found" });

        await Transaction.update(
          { status: "Success" },
          { where: { signature: signature_key }, transaction }
        );

        const wallet = await Wallet.findOne({ where: { userId: UUID } });
        if (!wallet)
          throw new AppError({
            statusCode: 404,
            message: "wallet not found",
          });

        switch (type) {
          case "T": {
            await Wallet.update(
              { balance: wallet.balance + Number(gross_amount) },
              { where: { userId: UUID }, transaction }
            );
            break;
          }
          case "P": {
            await Wallet.update(
              { balance: wallet.balance - Number(gross_amount) },
              { where: { userId: UUID }, transaction }
            );
          }
        }
        break;
      }
      case isCancel || isDeny || isExpire: {
        let status: TransactionStatus = "Cancel";

        switch (true) {
          case isCancel:
            status = "Cancel";
            break;
          case isDeny:
            status = "Deny";
            break;
          case isExpire:
            status = "Expired";
            break;
          default:
            break;
        }
        await Transaction.update(
          { status },
          { where: { signature: signature_key }, transaction }
        );
        break;
      }
      case transaction_status === "refund": {
        await Transaction.update(
          { status: "Refund" },
          { where: { signature: signature_key }, transaction }
        );
        break;
      }
      case transaction_status === "pending":
      default:
        break;
    }
    await transaction.commit();
    createResponse({ res, code: 200, message: transaction_status });
  } catch (err) {
    console.log(err)
    await transaction.rollback();
    next(err);
  }
};
