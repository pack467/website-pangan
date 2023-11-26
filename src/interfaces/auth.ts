export interface LoginInput {
  email: string;
  password: string;
  as: "User" | "Admin";
}

export interface BaseRegisterInput {
  email: string;
  password: string;
  confirmPassword: string;
}
