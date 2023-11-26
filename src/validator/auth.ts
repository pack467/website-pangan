import * as yup from "yup";
import validate, { passwordValidation } from ".";
import type { LoginInput, BaseRegisterInput } from "../interfaces/auth";

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

const baseRegisterField = {
  email: yup
    .string()
    .required("email is required")
    .email("invalid email format"),
  password: yup
    .string()
    .required("password is required")
    .test((val) => passwordValidation(val)),
  confirmPassword: yup.string().required("confirm password is required"),
};

export const userRegisterValidator = async (data: any) =>
  await validate<BaseRegisterInput & { username: string }>(
    yup
      .object()
      .shape({
        ...baseRegisterField,
        username: yup.string().required("username is required"),
      })
      .test(
        "is same",
        "password is not match with confirm password",
        (val) => val.password === val.confirmPassword
      ),
    data
  );

export const adminRegisterValidator = async (data: any) =>
  await validate<BaseRegisterInput & { name: string }>(
    yup
      .object()
      .shape({
        ...baseRegisterField,
        name: yup.string().required("name is required"),
      })
      .test(
        "is same",
        "password is not match with confirm password",
        (val) => val.password === val.confirmPassword
      ),
    data
  );
