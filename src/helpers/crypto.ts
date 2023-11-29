import { AES, enc } from "crypto-ts";

export const encrypt = (data: string) =>
  AES.encrypt(data.replace(/\s/g, "_"), process.env.ENCRYPTION_KEY);

export const decrypt = (data: string) =>
  AES.decrypt(data, process.env.ENCRYPTION_KEY)
    .toString(enc.Utf8)
    .replace(/_/g, " ");
