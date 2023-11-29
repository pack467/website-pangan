import * as yup from "yup";
import validate from ".";
import type { TopupInput } from "../interfaces/wallet";

export const topupValidator = async (data: any) =>
  await validate<TopupInput>(
    yup.object().shape({
      payment_type: yup
        .string()
        .required("payment_type is required")
        .oneOf(["bank_transfer"]),
      item_name: yup.string().required("item_name is required"),
      amount: yup.number().required("amount is required"),
      bank: yup
        .string()
        .required("bank is required")
        .oneOf(
          ["BCA", "BNI", "PERMATA", "BRI"],
          "invalid bank/bank is not provided"
        ),
    }),
    data
  );
