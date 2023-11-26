import * as yup from "yup";
import validate from ".";
import type { LoginInput } from "../interfaces/auth";

export const loginValidator = async (data: any) =>
  await validate<LoginInput>(
    yup.object().shape({
      email: yup
        .string()
        .required("email is required")
        .email("invalid email format"),
      password: yup.string().required("password is required"),
      as: yup
        .string()
        .default("User")
        .oneOf(["User", "Admin"], "Invalid account type"),
    }),
    data
  );
