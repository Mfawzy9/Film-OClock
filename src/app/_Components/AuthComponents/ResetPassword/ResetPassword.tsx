"use client";
import PageSection from "@/app/_Components/PageSection/PageSection";
import { auth } from "@/lib/firebase/config";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { SiSpinrilla } from "react-icons/si";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import PasswordInput from "../../PasswordInput/PasswordInput";
import { Link } from "@/i18n/navigation";

const ResetPassword = () => {
  const t = useTranslations("ResetPassword");
  const searchParams = useSearchParams();
  const router = useRouter();
  const oobCode = searchParams.get("oobCode");

  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isOobError, setIsOobError] = useState(false);

  const handleGetEmailFromOobCode = async (oobCode: string) => {
    try {
      const email = await verifyPasswordResetCode(auth, oobCode);
      return email;
    } catch (error) {
      console.error("Error verifying reset code:", error);
      setIsOobError(true);
      return null;
    }
  };

  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (oobCode) {
      handleGetEmailFromOobCode(oobCode).then((email) => {
        setUserEmail(email);
      });
    }
  }, [oobCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError(t("Validation.NewPassword.min"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      if (!oobCode) throw new Error("Invalid or missing reset code.");

      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccess(t("ToastsOrMessages.PasswordResetSuccessfully"));
      toast.success(t("ToastsOrMessages.PasswordResetSuccessfully"));
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFocus = () => {
    setError("");
    setSuccess("");
  };

  if (!oobCode || isOobError) {
    return (
      <PageSection className="flex flex-col justify-center items-center h-full">
        <p className="text-white text-lg border border-yellow-700 p-4 rounded shadow bg-gray-950">
          {t("ExpiredLink")}
        </p>
        <Link
          href="/auth/forgotPassword"
          className="py-2 px-4 mt-2 bg-blue-700 hover:bg-blue-600 rounded-md shadow-lg text-white
            font-semibold transition duration-200"
        >
          {t("GoBackBtn")}
        </Link>
      </PageSection>
    );
  }

  return (
    <>
      <PageSection className="px-0 flex items-center h-full w-full">
        <div
          className="max-w-md w-full bg-gray-950 shadow-blueGlow rounded-xl overflow-hidden p-3
            xs:p-5 sm:p-8 space-y-8 mx-auto"
        >
          <h2 className="text-center text-2xl xs:text-4xl font-extrabold text-white">
            {t("Title")}
          </h2>
          <p className="text-center text-gray-200 text-sm xs:text-base">
            {t("Subtitle")}{" "}
            {userEmail ? (
              <span className="text-blue-400 font-semibold">{userEmail}</span>
            ) : (
              t("yourAccount")
            )}
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <PasswordInput
              id="password"
              name="password"
              label={t("Form.NewPassword")}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              error={error}
              touched={!!error}
              onFocus={handleFocus}
            />

            {success && (
              <p
                className="mt-2 rounded p-1.5 xs:p-3 flex justify-center items-center gap-2 border-2
                  text-sm border-green-800"
              >
                <FaCheckCircle className="w-5 h-5 text-green-500" />
                {success}
              </p>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-2 items-center">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-blue-700 hover:bg-blue-600 rounded-md shadow-lg text-white
                  font-semibold transition duration-200 disabled:opacity-70
                  disabled:cursor-not-allowed disabled:hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <SiSpinrilla className="animate-spin text-lg" />{" "}
                    {t("Form.InProgress")}
                  </span>
                ) : (
                  t("Form.SavePassword")
                )}
              </button>
            </div>
          </form>
        </div>
      </PageSection>
    </>
  );
};

export default ResetPassword;
