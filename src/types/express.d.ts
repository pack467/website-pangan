import { AdminAttributes } from "../interfaces/admin";
import { TransactionAttributes } from "../interfaces/transaction";
import { UserAttributes } from "../interfaces/user";

declare global {
  namespace Express {
    interface Request {
      user: UserAttributes | AdminAttributes;
      loggedAs: "User" | "Admin";
      transaction: TransactionAttributes;
    }
  }
}
