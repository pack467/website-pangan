import * as yup from "yup";
import AppError from "../middlewares/error";

export default async function validate<T = any>(
  schema: yup.Schema,
  data: any
): Promise<T> {
  try {
    return (await schema.validate(data, {
      stripUnknown: true,
      abortEarly: false,
    })) as T;
  } catch (err) {
    const { errors } = err as { errors: string[] };

    throw new AppError({ message: errors.join(",\n "), statusCode: 400 });
  }
}
