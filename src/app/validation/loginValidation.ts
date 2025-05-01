import * as yup from "yup";
import { TFunction } from "../../../global";

export interface LoginFormFields {
  email: string;
  password: string;
}

export const loginSchema = (t: TFunction) => {
  return yup.object().shape({
    email: yup
      .string()
      .email(t("Validation.EmailAddress.email"))
      .required(t("Validation.EmailAddress.required")),
    password: yup
      .string()
      .min(6, t("Validation.Password.min"))
      .required(t("Validation.Password.required")),
  });
};
