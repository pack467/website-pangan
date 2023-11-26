import { hashSync, compareSync } from "bcryptjs";

export const hash = (data:string) => hashSync(data)

export const compareHash = (data:string,hash:string) => compareSync(data,hash)