import { JwtPayload, sign, SignOptions, verify } from "jsonwebtoken";
const secret = process.env.SECRET;

export type jwtValue = JwtPayload & BasePayload

export interface BasePayload {
  UUID: string;
  loggedAs: "User" | "Admin";
}

export const createToken = (
  data: {
    UUID: string;
    loggedAs: "User" | "Admin";
  },
  options?: SignOptions
) => sign({ ...data }, secret, options);

export const verifyToken = <T = jwtValue>(token: string) =>
  verify(token, secret) as T;
