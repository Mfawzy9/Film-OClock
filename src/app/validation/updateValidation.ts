import * as Yup from "yup";
import { TFunction } from "../../../global";

export interface UpdateFields {
  userName: string;
  email: string;
  password: string;
  rePassword: string;
}
export const updateSchema = (t: TFunction) => {
  return Yup.object().shape({
    userName: Yup.string()
      .min(3, t("SettingsPart.Validation.UserName.min"))
      .max(20, t("SettingsPart.Validation.UserName.max")),
    email: Yup.string().email(t("SettingsPart.Validation.EmailAddress.email")),
    password: Yup.string().min(6, t("SettingsPart.Validation.NewPassword.min")),
    rePassword: Yup.string().when("password", {
      is: (val: string) => val && val.length > 0,
      then: (schema) =>
        schema
          .required(t("SettingsPart.Validation.ConfirmPassword.required"))
          .oneOf(
            [Yup.ref("password")],
            t("SettingsPart.Validation.ConfirmPassword.oneOf"),
          ),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
};
