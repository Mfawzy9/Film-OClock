import * as yup from "yup";
import { TFunction } from "../../../global";

export interface RegisterFormFields {
  userName: string;
  email: string;
  password: string;
  rePassword: string;
}

export const registerSchema = (t: TFunction) => {
  return yup.object().shape({
    userName: yup
      .string()
      .min(3, t("Validation.UserName.min"))
      .max(25, t("Validation.UserName.max"))
      .required(t("Validation.UserName.required")),
    email: yup
      .string()
      .email(t("Validation.EmailAddress.email"))
      .required(t("Validation.EmailAddress.required")),
    password: yup
      .string()
      .min(6, t("Validation.Password.min"))
      .required(t("Validation.Password.required")),
    rePassword: yup
      .string()
      .required(t("Validation.ConfirmPassword.required"))
      .oneOf([yup.ref("password")], t("Validation.ConfirmPassword.oneOf")),
  });
};
