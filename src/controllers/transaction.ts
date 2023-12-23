import type { Request, Response, NextFunction } from "express";
import { Transaction } from "../models";
import AppError from "../middlewares/error";
import { statusDataNotFound, statusForbidden } from "../constant";
import createResponse from "../middlewares/response";

export const getMyTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { UUID } = req.user;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { sorting = "createdAt", sort = "DESC" } = req.query as Record<
      string,
      string
    >;

    const { rows: data, count: totalData } = await Transaction.findAndCountAll({
      offset: (page - 1) * limit,
      limit,
      order: [
        [
          ["createdat", "status", "amount", "type"].includes(
            sorting.toLowerCase()
          )
            ? sorting
            : "createdAt",
          ["ASC", "DESC"].includes(sort.toUpperCase()) ? sort : "DESC",
        ],
      ],
      where: {
        userId: UUID,
      },
    });

    if (!data.length) throw new AppError(statusDataNotFound);

    createResponse(
      {
        res,
        code: 200,
        message: "OK",
        data: data.map((el) => ({
          userId: el.userId,
          type: el.type,
          status: el.status,
          amount: el.amount,
          createdAt: el.createdAt,
          updatedAt: el.updatedAt,
          UUID: el.UUID,
        })),
      },
      {
        page,
        limit,
        totalData,
        totalPage: Math.ceil(totalData / limit),
      }
    );
  } catch (err) {
    next(err);
  }
};

export const getAllTransaction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const { sorting = "createdAt", sort = "DESC" } = req.query as Record<
      string,
      string
    >;

    const { rows: data, count: totalData } = await Transaction.findAndCountAll({
      offset: (page - 1) * limit,
      limit,
      order: [
        [
          ["createdat", "status", "amount", "type"].includes(
            sorting.toLowerCase()
          )
            ? sorting
            : "createdAt",
          ["ASC", "DESC"].includes(sort.toUpperCase()) ? sort : "DESC",
        ],
      ],
    });

    if (!data.length) throw new AppError(statusDataNotFound);

    createResponse(
      {
        res,
        code: 200,
        message: "OK",
        data,
      },
      {
        page,
        limit,
        totalData,
        totalPage: Math.ceil(totalData / limit),
      }
    );
  } catch (err) {
    next(err);
  }
};

export const getTransactionById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { transactionId } = req.params;
    const { UUID } = req.user;

    const data = await Transaction.findOne({ where: { UUID: transactionId } });
    if (!data) throw new AppError(statusDataNotFound);

    if (data.userId !== UUID) throw new AppError(statusForbidden);

    createResponse({ res, code: 200, message: "OK", data });
  } catch (err) {
    next(err);
  }
};
