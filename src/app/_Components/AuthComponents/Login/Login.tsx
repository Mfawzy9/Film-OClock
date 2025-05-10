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
import { useRouter, useSearchParams } from "next/navigation";
import { MdNearbyError } from "react-icons/md";

const Login = () => {
  const t = useTranslations("Login");
  const [initialized, setInitialized] = useState(false);
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
              <MdNearbyError className="text-yellow-500 text-3xl animate-pulse" />
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

  // Check if user is already authenticated
  // useEffect(() => {
  //   if (auth.currentUser) {
  //     router.push("/");
  //     return;
  //   }
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       router.push("/");
  //     }
  //   });

  //   return () => unsubscribe();
  // }, [router]);

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

  // get email and password from cookies
  useEffect(() => {
    const getEmailAndPasswordFromCookies = async () => {
      const response = await fetch("/api/auth/rememberMe");
      const { email, password } = await response.json();

      if (email && password && !initialized) {
        formik.setValues({ email, password });
        setRememberMe(true);
        setInitialized(true);
      }
    };

    getEmailAndPasswordFromCookies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized]);

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
