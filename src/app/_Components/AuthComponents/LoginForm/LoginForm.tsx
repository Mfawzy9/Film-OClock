import { LoginFormFields } from "@/app/validation/loginValidation";
import { FormikProps } from "formik";
import { Link } from "@/i18n/navigation";
import PageSection from "../../PageSection/PageSection";
import { setError } from "@/lib/Redux/localSlices/authSlice";
import { signInWithGoogle } from "@/lib/firebase/authService";
import { AppDispatch } from "@/lib/Redux/store";
import PasswordInput from "../../PasswordInput/PasswordInput";
import { useRouter } from "@bprogress/next/app";
import { FaInfoCircle } from "@react-icons/all-files/fa/FaInfoCircle";
import { FcGoogle } from "@react-icons/all-files/fc/FcGoogle";
import { SiSpinrilla } from "@react-icons/all-files/si/SiSpinrilla";
import { TFunction } from "../../../../../global";

interface LoginFormProps {
  formik: FormikProps<LoginFormFields>;
  dispatch: AppDispatch;
  error: string | null;
  isLoading: boolean;
  isGoogleLoading: boolean;
  rememberMe: boolean;
  setRememberMe: React.Dispatch<React.SetStateAction<boolean>>;
  t: TFunction;
}

const LoginForm = ({
  formik,
  dispatch,
  error,
  isLoading,
  isGoogleLoading,
  rememberMe,
  setRememberMe,
  t,
}: LoginFormProps) => {
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(e);
    if (error) {
      dispatch(setError(""));
    }
  };

  return (
    <>
      <PageSection className="!px-2 flex items-center h-full w-full">
        <div
          className="max-w-md w-full bg-gray-950 shadow-blueGlow rounded-xl overflow-hidden p-3
            xs:p-5 sm:p-8 space-y-8 mx-auto"
        >
          <h2 className="text-center text-xl xs:text-4xl font-extrabold text-white">
            {t("Form.Title")}
          </h2>
          <p className="text-center text-sm xs:text-base text-gray-200">
            {t("Form.subtitle")}
          </p>
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            {/* Email */}
            <div className="relative">
              <input
                name="email"
                placeholder="john@example.com"
                autoComplete="email"
                className="peer px-1 h-10 w-full border-b-2 border-gray-300 text-white bg-transparent
                  placeholder-transparent focus:outline-none focus:border-blue-500"
                id="email"
                type="text"
                value={formik.values.email}
                onChange={handleChange}
                onBlur={formik.handleBlur}
              />
              <label
                htmlFor="email"
                className="absolute start-0 -top-3.5 text-gray-500 text-sm transition-all
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                  peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-500
                  peer-focus:text-sm"
              >
                {t("Form.Email")}
              </label>
              {formik.errors.email && formik.touched.email && (
                <p
                  className="mt-3 rounded p-1.5 xs:p-3 flex items-center gap-2 border-2 text-sm
                    border-red-800"
                >
                  <FaInfoCircle className="animate-pulse w-5 h-5 text-red-500" />
                  {formik.errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <PasswordInput
              id="password"
              name="password"
              label={t("Form.Password")}
              value={formik.values.password}
              onChange={handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password}
              touched={formik.touched.password}
            />

            {error && (
              <p
                className="mt-2 rounded font-bold p-1.5 xs:p-3 flex justify-center items-center gap-2
                  border-2 text-sm border-red-800"
              >
                <FaInfoCircle className="animate-pulse w-5 h-5 text-red-500" />
                {error}
              </p>
            )}

            {/* forget password */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label className="flex items-center text-sm text-gray-200">
                <input
                  className="form-checkbox h-4 w-4 text-purple-600 bg-gray-800 border-gray-300 rounded"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                <span className="ms-2">{t("Form.RememberMe")}</span>
              </label>
              <Link
                className="text-sm text-blue-200 hover:underline"
                href="/auth/forgotPassword"
              >
                {t("Form.ForgotPassword")}
              </Link>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-2 items-center">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-700 hover:bg-blue-600 rounded-md shadow-lg text-white
                  font-semibold transition duration-200 disabled:opacity-50
                  disabled:cursor-not-allowed disabled:hover:bg-blue-700 text-sm xs:text-base"
                disabled={
                  formik.isSubmitting ||
                  !(formik.isValid && formik.dirty) ||
                  isLoading ||
                  isGoogleLoading
                }
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <SiSpinrilla className="animate-spin text-lg" />{" "}
                    {t("Form.LoggingIn")}
                  </span>
                ) : (
                  t("Form.Login")
                )}
              </button>
              <span>{t("Form.Or")}</span>
              <button
                disabled={isGoogleLoading || isLoading || formik.isSubmitting}
                onClick={() => signInWithGoogle({ router, t })}
                type="button"
                className="w-full py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-md shadow-lg text-white
                  font-semibold transition duration-200 flex items-center justify-center gap-2
                  disabled:cursor-not-allowed disabled:hover:bg-gray-800 disabled:opacity-70
                  text-sm xs:text-base"
              >
                {isGoogleLoading ? (
                  <>
                    <SiSpinrilla className="animate-spin text-lg" />{" "}
                    {t("Form.LoggingIn")}
                  </>
                ) : (
                  <>
                    <FcGoogle className="text-2xl" />
                    {t("Form.LoginWithGoogle")}
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center text-gray-300 text-sm xs:text-base">
            {t("Form.DontHaveAccount")}{" "}
            <Link className="text-blue-300 hover:underline" href="/auth/signup">
              {t("Form.SignUp")}
            </Link>
          </div>
        </div>
      </PageSection>
    </>
  );
};

export default LoginForm;
