"use client";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import {
  setError,
  setLoading,
  setUser,
  User,
} from "@/lib/Redux/localSlices/authSlice";
import { useFormik } from "formik";
import { sanitizeFirebaseUser } from "@/lib/firebase/authService";
import { useRouter } from "@/i18n/navigation";
import RegisterFrom from "@/app/_Components/AuthComponents/RegisterFrom/RegisterFrom";
import { useEffect } from "react";
import {
  RegisterFormFields,
  registerSchema,
} from "@/app/validation/registerValidation";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const Signup = () => {
  const t = useTranslations("Register");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error, isGoogleLoading } = useSelector(
    (state: RootState) => state.authReducer,
  );

  const handleSubmit = async (inputs: RegisterFormFields) => {
    dispatch(setLoading(true));

    const { email, password, userName } = inputs;
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const user = res.user;

      await updateProfile(user, {
        displayName: userName,
      });
      toast.success(t("ToastsOrMessages.RegistrationSuccessful"));

      const updatedUser = sanitizeFirebaseUser(user as unknown as User);
      if (updatedUser) {
        dispatch(setUser(updatedUser));
        router.push("/");
        formik.resetForm();
      }

      const idToken = await user.getIdToken();
      const sessionRes = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!sessionRes.ok) {
        throw new Error("Session creation failed");
      }
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        dispatch(setError(t("ToastsOrMessages.EmailALreadyInUseError")));
      } else if (err.code === "auth/weak-password") {
        dispatch(setError(t("ToastsOrMessages.WeakPasswordError")));
      } else {
        dispatch(setError(err.message || t("ToastsOrMessages.DefaultError")));
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  //formik
  const formik = useFormik({
    initialValues: {
      userName: "",
      email: "",
      password: "",
      rePassword: "",
    },

    validationSchema: registerSchema(t),

    onSubmit: handleSubmit,
  });

  // Check if user is already authenticated
  useEffect(() => {
    if (auth.currentUser) {
      router.push("/");
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <>
      <RegisterFrom
        formik={formik}
        dispatch={dispatch}
        error={error}
        isLoading={isLoading}
        isGoogleLoading={isGoogleLoading}
      />
    </>
  );
};

export default Signup;
