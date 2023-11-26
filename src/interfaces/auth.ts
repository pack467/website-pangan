export interface LoginInput {
  email: string;
  password: string;
  as: "User" | "Admin";
}
