"use client";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import {
  setError,
  setLoading,
  setUser,
  User,
} from "@/lib/Redux/localSlices/authSlice";
import { sanitizeFirebaseUser, signOutUser } from "@/lib/firebase/authService";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { LoginFormFields, loginSchema } from "@/app/validation/loginValidation";
import { auth } from "@/lib/firebase/config";
import LoginForm from "@/app/_Components/AuthComponents/LoginForm/LoginForm";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { isTokenExpired } from "../../../../../helpers/checkToken";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@bprogress/next/app";
import { GoShield } from "@react-icons/all-files/go/GoShield";
import CryptoJS from "crypto-js";

const decrypt = (value: string) =>
  CryptoJS.AES.decrypt(value, "SECRET_KEY").toString(CryptoJS.enc.Utf8);

const Login = ({ email, password }: { email?: string; password?: string }) => {
  const t = useTranslations("Login");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isGoogleLoading } = useSelector(
    (state: RootState) => state.authReducer,
  );

  const searchParams = useSearchParams();

  useEffect(() => {
    const checkCookiesAuth = async () => {
      const res = await fetch("/api/auth/check-auth");
      const { isAuthenticated } = await res.json();
      if (
        searchParams.get("reason") === "session-expired" &&
        !isAuthenticated
      ) {
        signOutUser().then(() => {
          toast.warning(t("ToastsOrMessages.SessionExpired"), {
            className:
              "!text-yellow-200 !text-xl !w-fit !text-nowrap !flex !items-center !gap-5 font-cairo",
            icon: (
              <GoShield className="text-yellow-500 text-3xl animate-pulse" />
            ),
          });
        });
      } else if (auth.currentUser && isAuthenticated) {
        const previousRoute = sessionStorage.getItem("previousRoute");
        router.push(previousRoute || "/");
      }
    };

    checkCookiesAuth();
  }, [searchParams, t, router]);

  // login
  const handleSubmit = async (inputs: LoginFormFields) => {
    dispatch(setLoading(true));

    const { email, password } = inputs;
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      const user = res.user;
      toast.success(t("ToastsOrMessages.LoginSuccessful"));
      const previousRoute = sessionStorage.getItem("previousRoute");
      router.push(previousRoute || "/");

      const updatedUser = sanitizeFirebaseUser(user as unknown as User);
      dispatch(setUser(updatedUser));
      formik.resetForm();

      const idToken = await user.getIdToken(true);
      if (isTokenExpired(idToken)) {
        toast.error(t("ToastsOrMessages.TokenIsExpired"));
        throw new Error("Token is expired. Please login again.");
      }
      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, rememberMe, email, password }),
      });

      document.cookie = "loggedOut=false; path=/;";

      if (!sessionRes.ok) {
        throw new Error("Session creation failed");
      }
    } catch (err: any) {
      console.error(err.message);

      if (err.message === "Firebase: Error (auth/invalid-credential).") {
        dispatch(setError(t("ToastsOrMessages.InvalidEmailOrPassword")));
      } else if (err.message === "Firebase: Error (auth/user-not-found).") {
        dispatch(setError(t("ToastsOrMessages.UserNotFound")));
      } else if (err.message === "Firebase: Error (auth/wrong-password).") {
        dispatch(setError(t("ToastsOrMessages.WrongPassword")));
      } else {
        dispatch(setError(err.message || t("ToastsOrMessages.LoginFailed")));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  //formik
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: loginSchema(t),

    onSubmit: handleSubmit,
  });

  useEffect(() => {
    if (email && password) {
      const decryptedEmail = decrypt(email);
      const decryptedPassword = decrypt(password);
      if (
        formik.values.email !== decryptedEmail ||
        formik.values.password !== decryptedPassword
      )
        formik.setValues({
          email: decryptedEmail,
          password: decryptedPassword,
        });
      setRememberMe(true);
    }
  }, [email, password, formik]);

  return (
    <>
      <LoginForm
        isGoogleLoading={isGoogleLoading}
        formik={formik}
        dispatch={dispatch}
        error={error}
        isLoading={isLoading}
        setRememberMe={setRememberMe}
        rememberMe={rememberMe}
      />
    </>
  );
};

export default Login;
