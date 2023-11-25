import type { NextFunction, Request, Response } from "express";
import AppError, {type ApplicationError } from "./error";
import {
  ValidationError,
  ValidationErrorItem,
  UniqueConstraintError,
} from "sequelize";

export default function ErrorHandler(
    err:
      | ValidationError
      | ValidationErrorItem
      | UniqueConstraintError
      | ApplicationError,
    req: Request,
    res: Response,
    next: NextFunction
){
    let message =
      err instanceof AppError ? err.message : "Internal Server Error";
    let code =
      err instanceof AppError ? (err as ApplicationError).statusCode : 500;

    if (
      err instanceof ValidationError ||
      err instanceof ValidationErrorItem ||
      err instanceof UniqueConstraintError
    ) {
      code = 400;
      switch ((err as any).name) {
        case "SequelizeUniqueConstraintError":
          {
            if ((err as any).parent.constraint === "Users_email_key") {
              message = "email is already use";
            } else if (
              (err as any).parent.constraint === "Users_username_key"
            ) {
              message = "username is already use";
            } else {
              message = (err as any).errors[0].message;
            }
          }
          break;
        case "SequelizeValidationError": {
          message = (err as any).errors.join(", \n");
          break;
        }
        default: {
          message = err.message;
          break;
        }
      }
    }
}