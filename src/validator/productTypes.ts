import * as yup from "yup";
import validate from ".";

export const validateCreateType = async (data: any) =>
  await validate<{ type: string }>(
    yup.object().shape({
      type: yup.string().required("type is required"),
    }),
    data
  );
