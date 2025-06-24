import { User } from "@/lib/Redux/localSlices/authSlice";
import Title from "../Title/Title";
import {
  updateEmail,
  updatePassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signOutUser } from "@/lib/firebase/authService";
import { useState } from "react";
import { UpdateFields, updateSchema } from "@/app/validation/updateValidation";
import { useRouter as useNextIntlRouter } from "@/i18n/navigation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "@bprogress/next/app";
import { FaCheckCircle } from "@react-icons/all-files/fa/FaCheckCircle";
import { FaEye } from "@react-icons/all-files/fa/FaEye";
import { FaEyeSlash } from "@react-icons/all-files/fa/FaEyeSlash";
import { FaInfoCircle } from "@react-icons/all-files/fa/FaInfoCircle";
import { IoWarningOutline } from "@react-icons/all-files/io5/IoWarningOutline";
import { SiSpinrilla } from "@react-icons/all-files/si/SiSpinrilla";

const UpdateProfile = ({ user }: { user: User | null }) => {
  const t = useTranslations("Account");
  const [showPassword, setShowPassword] = useState({
    password: false,
    rePassword: false,
  });

  const [isLoading, setIsLoading] = useState({
    submitLoading: false,
    deleteLoading: false,
  });
  const [responseError, setResponseError] = useState<string | null>(null);
  const [responseSucess, setresponseSucess] = useState<string | null>(null);
  const router = useRouter({ customRouter: useNextIntlRouter });

  const handleVerify = async () => {
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser!);
      toast.success(
        t("SettingsPart.ToastsAndMessages.VerificationEmailSentSuccessfully"),
      );
      setresponseSucess(
        t("SettingsPart.ToastsAndMessages.VerificationEmailSentSuccessfully"),
      );
    } catch (error: any) {
      console.error(error.message);
    }
  };

  //handle submit
  const handleSubmit = async (inputs: UpdateFields) => {
    const { userName, email, password, rePassword } = inputs;
    const promises = [];
    if (
      email !== user?.email &&
      Yup.string().email().isValidSync(email) &&
      user?.emailVerified
    ) {
      promises.push(updateEmail(auth.currentUser!, email));
    }
    if (password && password === rePassword) {
      promises.push(updatePassword(auth.currentUser!, password));
    }
    if (userName !== user?.displayName && userName) {
      promises.push(
        updateProfile(auth.currentUser!, {
          displayName: userName,
        }),
      );
    }
    setIsLoading({ ...isLoading, submitLoading: true });
    await Promise.all(promises)
      .then(async () => {
        await signOutUser();
        router.push("/auth/login");
        toast.success(
          t("SettingsPart.ToastsAndMessages.ProfileUpdatedSuccessfully"),
        );
      })
      .catch((error) => {
        if (error.code === "auth/requires-recent-login") {
          toast.error(t("SettingsPart.ToastsAndMessages.ReloginToUpdateError"));
          setResponseError(
            t("SettingsPart.ToastsAndMessages.ReloginToUpdateError"),
          );
        } else if (error.code === "auth/email-already-in-use") {
          setResponseError(
            t("SettingsPart.ToastsAndMessages.email-already-in-useError"),
          );
        } else if (
          error.message ===
          "Firebase: Please verify the new email before changing email. (auth/operation-not-allowed)."
        ) {
          setResponseError(
            t("SettingsPart.ToastsAndMessages.VerifyTheNewEmailFirstError"),
          );
          toast.error(
            t("SettingsPart.ToastsAndMessages.VerifyTheNewEmailFirstError"),
          );
        } else {
          toast.error(error.message);
          setResponseError(error.message);
        }
      })
      .finally(() => setIsLoading({ ...isLoading, submitLoading: false }));
  };

  //formik
  const formik = useFormik({
    initialValues: {
      userName: user?.displayName ?? "",
      email: user?.email ?? "",
      password: "",
      rePassword: "",
    },

    validationSchema: updateSchema(t),

    onSubmit: handleSubmit,
  });

  // delete account
  const handleDelete = async () => {
    if (!auth.currentUser || !user) return;
    setIsLoading({ ...isLoading, deleteLoading: true });
    try {
      await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      toast.success(
        t("SettingsPart.ToastsAndMessages.AccountDeletedSuccessfully"),
      );
      router.push("/");
      await signOutUser();
    } catch (err: any) {
      if (err.code === "auth/requires-recent-login") {
        toast.error(t("SettingsPart.ToastsAndMessages.ReLoginToDeleteError"));
      } else {
        toast.error(
          err.message || t("SettingsPart.ToastsAndMessages.DefaultDeleteError"),
        );
      }
    } finally {
      setIsLoading({ ...isLoading, deleteLoading: false });
    }
  };

  if (!user) return null;

  return (
    <main className="w-full bg-black shadow-blueGlow shadow-white/20 p-3 sm:p-5">
      {!user.emailVerified &&
        responseSucess !==
          t(
            "SettingsPart.ToastsAndMessages.VerificationEmailSentSuccessfully",
          ) && (
          <div className="flex flex-col gap-3 mb-5">
            <Title title={t("SettingsPart.VerifyAccountTitle")} />
            <p className="text-white/70 font-sans text-[14px]">
              {t("SettingsPart.VerifyMessage")}
            </p>
            <button
              type="button"
              onClick={handleVerify}
              className="text-blue-500 hover:underline w-fit"
            >
              {t("SettingsPart.VerifyNow")}
            </button>
          </div>
        )}
      <Title title={t("SettingsPart.UpdateProfileTitle")} />

      {/* update user name */}
      <form className="flex flex-col gap-6" onSubmit={formik.handleSubmit}>
        {/* name */}
        <div className="flex flex-col">
          <span className="text-white/70 font-sans text-[14px] my-1">
            {t("SettingsPart.UserName")}
          </span>
          <input
            placeholder={t("SettingsPart.UserNamePlaceholder")}
            className="px-3 w-full text-[14px] bg-[#171616] text-white p-2 border border-white/10
              rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500"
            name="userName"
            autoComplete="username"
            type="text"
            value={formik.values.userName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.userName && formik.errors.userName && (
            <p
              className="mt-3 rounded p-1.5 xs:p-3 flex items-center gap-2 border-2 text-sm
                border-red-800"
            >
              <FaInfoCircle className="animate-pulse w-5 h-5 text-red-500" />
              {formik.errors.userName}
            </p>
          )}
        </div>
        {/* email */}
        <div className="flex flex-col">
          <span className="text-white/70 font-sans text-[14px] my-1">
            {t("SettingsPart.EmailAddress")}
          </span>
          <input
            placeholder={t("SettingsPart.EmailAddressPlaceholder")}
            className="px-3 w-full text-[14px] bg-[#171616] text-white p-2 border border-white/10
              rounded-md outline-none ring-2 ring-blue-500/0 focus:ring-blue-500
              disabled:cursor-not-allowed disabled:opacity-70"
            name="email"
            type="text"
            autoComplete="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            disabled={!user.emailVerified}
          />
          {!user.emailVerified &&
            responseSucess !==
              t(
                "SettingsPart.ToastsAndMessages.VerificationEmailSentSuccessfully",
              ) && (
              <p className="mt-3 rounded flex flex-wrap items-center gap-2 text-sm text-yellow-500">
                {t("SettingsPart.EmailAddressWarning")}
              </p>
            )}
          {formik.touched.email && formik.errors.email && (
            <p
              className="mt-3 rounded p-1.5 xs:p-3 flex items-center gap-2 border-2 text-sm
                border-red-800"
            >
              <FaInfoCircle className="animate-pulse w-5 h-5 text-red-500" />
              {formik.errors.email}
            </p>
          )}
        </div>
        {/* password */}
        <div className="flex flex-wrap gap-4">
          {/* new password */}
          <div className="flex flex-col relative grow">
            <span className="text-white/70 font-sans text-[14px] my-1">
              {t("SettingsPart.NewPassword")}
            </span>
            <input
              placeholder={t("SettingsPart.NewPasswordPlaceholder")}
              className="px-3 placeholder:opacity-50 w-full text-[14px] bg-[#171616] text-white p-2
                border border-white/10 rounded-md outline-none ring-2 ring-blue-500/0
                focus:ring-blue-500"
              name="password"
              autoComplete="off"
              type={showPassword.password ? "text" : "password"}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {showPassword.password ? (
              <FaEye
                className="absolute end-3 top-10 cursor-pointer text-lg hover:text-blue-400"
                onClick={() =>
                  setShowPassword((prev) => ({ ...prev, password: false }))
                }
              />
            ) : (
              <FaEyeSlash
                className="absolute end-3 top-10 cursor-pointer text-lg hover:text-blue-400"
                onClick={() =>
                  setShowPassword((prev) => ({ ...prev, password: true }))
                }
              />
            )}
            {formik.touched.password && formik.errors.password && (
              <p
                className="mt-3 rounded p-1.5 xs:p-3 flex items-center gap-2 border-2 text-sm
                  border-red-800"
              >
                <FaInfoCircle className="animate-pulse w-5 h-5 text-red-500" />
                {formik.errors.password}
              </p>
            )}
          </div>
          {/* confirm password */}
          <div className="flex flex-col relative grow">
            <span className="text-white/70 font-sans text-[14px] my-1">
              {t("SettingsPart.ConfirmPassword")}
            </span>
            <input
              placeholder={t("SettingsPart.ConfirmPasswordPlaceholder")}
              className="px-3 placeholder:opacity-50 w-full text-[14px] bg-[#171616] text-white p-2
                border border-white/10 rounded-md outline-none ring-2 ring-blue-500/0
                focus:ring-blue-500"
              name="rePassword"
              type={showPassword.rePassword ? "text" : "password"}
              autoComplete="off"
              value={formik.values.rePassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {showPassword.rePassword ? (
              <FaEye
                className="absolute end-3 top-10 cursor-pointer text-lg hover:text-blue-400"
                onClick={() =>
                  setShowPassword((prev) => ({ ...prev, rePassword: false }))
                }
              />
            ) : (
              <FaEyeSlash
                className="absolute end-3 top-10 cursor-pointer text-lg hover:text-blue-400"
                onClick={() =>
                  setShowPassword((prev) => ({ ...prev, rePassword: true }))
                }
              />
            )}
            {formik.touched.rePassword && formik.errors.rePassword && (
              <p
                className="mt-3 rounded p-1.5 xs:p-3 flex items-center gap-2 border-2 text-sm
                  border-red-800"
              >
                <FaInfoCircle className="animate-pulse w-5 h-5 text-red-500" />
                {formik.errors.rePassword}
              </p>
            )}
          </div>
        </div>

        {responseSucess && (
          <p
            className="mt-2 rounded p-1.5 xs:p-3 flex justify-center items-center gap-2 border-2
              text-sm border-green-800"
          >
            <FaCheckCircle className="w-5 h-5 text-green-500" />
            {responseSucess}
          </p>
        )}

        {responseError && (
          <p
            className="mt-3 rounded p-1.5 xs:p-3 flex items-center gap-2 border-2 text-sm
              border-red-800"
          >
            <FaInfoCircle className="animate-pulse w-5 h-5 text-red-500" />
            {responseError !==
            t("SettingsPart.ToastsAndMessages.VerifyTheNewEmailFirstError") ? (
              responseError
            ) : (
              <span>
                {responseError}{" "}
                <button
                  type="button"
                  onClick={handleVerify}
                  className="text-blue-400 hover:underline"
                >
                  {t("SettingsPart.VerifyNow")}
                </button>
              </span>
            )}
          </p>
        )}

        {/* btn */}
        <button
          type="submit"
          className="w-fit py-2 px-4 bg-blue-700 hover:bg-blue-600 rounded-md shadow-lg text-white
            font-semibold transition duration-200 disabled:opacity-70
            disabled:cursor-not-allowed disabled:hover:bg-blue-700"
          disabled={isLoading.submitLoading || !formik.dirty}
        >
          {isLoading.submitLoading ? (
            <span className="flex items-center gap-2 justify-center">
              <SiSpinrilla className="animate-spin text-lg" /> In Progress
            </span>
          ) : (
            t("SettingsPart.SaveChanges")
          )}
        </button>
      </form>
      {/* delete account */}
      <div className="mt-10 flex flex-col gap-3">
        <Title title={t("SettingsPart.DeleteAccountTitle")} />
        <h5
          className="text-red-800 font-medium me-2 px-2.5 py-1 rounded bg-red-300 border
            border-red-400 w-fit flex items-center gap-2"
        >
          <IoWarningOutline className="text-2xl" />
          {t("SettingsPart.DeleteAccountWarning")}
        </h5>
        <p className="text-white/70 font-sans text-[14px]">
          {t("SettingsPart.DeleteAccountMessage")}
        </p>
        <button
          disabled={isLoading.deleteLoading}
          type="button"
          onClick={handleDelete}
          className={`text-red-500 hover:underline disabled:no-underline w-fit disabled:opacity-70
            disabled:cursor-not-allowed`}
        >
          {isLoading.deleteLoading ? (
            <span className="flex items-center gap-2">
              <SiSpinrilla className="animate-spin text-2xl" />
              {t("SettingsPart.DeletingAccount")}
            </span>
          ) : (
            t("SettingsPart.DeleteAccount")
          )}
        </button>
      </div>
    </main>
  );
};

export default UpdateProfile;
