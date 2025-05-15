"use client";
import PageSection from "@/app/_Components/PageSection/PageSection";
import { Link } from "@/i18n/navigation";
import { auth } from "@/lib/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { FaCheckCircle, FaInfoCircle } from "react-icons/fa";
import { SiSpinrilla } from "react-icons/si";

const ForgotPassword = () => {
  const t = useTranslations("ForgotPassword");
  const [loading, setLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [cooldown, setCooldown] = useState<number>(0);
  const [alerts, setAlerts] = useState({
    inputError: "",
    responseError: "",
    successMessage: "",
  });

  // Countdown timer effect
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const isEmailValid = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleFocus = () => {
    setAlerts({
      inputError: "",
      responseError: "",
      successMessage: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if in cooldown
    if (cooldown > 0) {
      setAlerts((prevAlerts) => ({
        ...prevAlerts,
        inputError: t("ToastsOrMessages.PleaseWait"),
      }));
      return;
    }

    if (!isEmailValid(email)) {
      setAlerts((prevAlerts) => ({
        ...prevAlerts,
        inputError: t("ToastsOrMessages.InvalidEmailFormat"),
      }));
      return;
    }

    setAlerts({
      inputError: "",
      responseError: "",
      successMessage: "",
    });

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);

      setAlerts((prevAlerts) => ({
        ...prevAlerts,
        successMessage: t(
          "ToastsOrMessages.PasswordResetEmailSentSuccessfully",
        ),
      }));

      // Start 30-second cooldown
      setCooldown(30);

      setEmail("");
    } catch (error: any) {
      console.error(error.message);

      if (error.code === "auth/invalid-email") {
        setAlerts((prevAlerts) => ({
          ...prevAlerts,
          responseError: t("ToastsOrMessages.InvalidEmailError"),
        }));
      } else if (error.code === "auth/user-not-found") {
        setAlerts((prevAlerts) => ({
          ...prevAlerts,
          responseError: t("ToastsOrMessages.NoUserFoundWithTHisEmailError"),
        }));
      } else if (error.code === "auth/too-many-requests") {
        setAlerts((prevAlerts) => ({
          ...prevAlerts,
          responseError: t("ToastsOrMessages.TooManyRequestsError"),
        }));
        setCooldown(30);
      } else {
        setAlerts((prevAlerts) => ({
          ...prevAlerts,
          responseError: t("ToastsOrMessages.DefaultError"),
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageSection className="!px-2 sm:!px-3 flex items-center h-full w-full">
        <div
          className="max-w-md w-full bg-gray-950 shadow-blueGlow rounded-xl overflow-hidden p-3
            xs:p-5 sm:p-8 space-y-8 mx-auto"
        >
          <h2 className="text-center text-2xl xs:text-3xl font-extrabold text-white">
            {t("Title")}
          </h2>
          <p className="text-center text-gray-200 text-sm xs:text-base">
            {t("subtitle")}
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={handleFocus}
                disabled={cooldown > 0}
              />
              <label
                htmlFor="email"
                className="absolute start-0 -top-3.5 text-gray-500 text-sm transition-all
                  peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400
                  peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-blue-500
                  peer-focus:text-sm"
              >
                {t("Email")}
              </label>
              {alerts.inputError && (
                <p
                  className="mt-3 rounded p-1.5 xs:p-3 flex items-center gap-2 border-2 text-sm
                    border-red-800"
                >
                  <FaInfoCircle className="animate-pulse w-5 h-5 text-red-500" />
                  {alerts.inputError}
                </p>
              )}
            </div>

            {alerts.responseError ? (
              <p
                className="mt-2 rounded p-1.5 xs:p-3 flex justify-center items-center gap-2 border-2
                  text-sm border-red-800 leading-relaxed"
              >
                <FaInfoCircle className="animate-pulse w-5 h-5 text-red-500" />
                {alerts.responseError}
              </p>
            ) : alerts.successMessage ? (
              <p
                className="mt-2 rounded p-1.5 xs:p-3 flex justify-center items-center gap-2 border-2
                  text-sm border-green-800 leading-relaxed"
              >
                <FaCheckCircle className="w-5 h-5 text-green-500" />
                {alerts.successMessage}
              </p>
            ) : null}

            {/* Buttons */}
            <div className="flex flex-col gap-2 items-center">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-700 hover:bg-blue-600 rounded-md shadow-lg text-white
                  font-semibold transition duration-200 disabled:opacity-70
                  disabled:cursor-not-allowed disabled:hover:bg-blue-700"
                disabled={loading || cooldown > 0}
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <SiSpinrilla className="animate-spin text-lg" />{" "}
                    {t("SendingEmail")}
                  </span>
                ) : cooldown > 0 ? (
                  `${t("Tryagainin")} ${cooldown}${t("Second")}`
                ) : (
                  t("SendEmailBtn")
                )}
              </button>
            </div>
          </form>

          <div className="text-center text-gray-300">
            <Link className="text-blue-300 hover:underline" href="/auth/login">
              {t("GoToLogin")}
            </Link>
          </div>
        </div>
      </PageSection>
    </>
  );
};

export default ForgotPassword;
