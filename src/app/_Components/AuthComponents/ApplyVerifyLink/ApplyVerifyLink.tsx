"use client";
import { auth } from "@/lib/firebase/config";
import { applyActionCode, checkActionCode, reload } from "firebase/auth";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import PageSection from "../../PageSection/PageSection";
import { Link, useRouter as useNextIntlRouter } from "@/i18n/navigation";
import { SiSpinrilla } from "react-icons/si";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { sanitizeFirebaseUser } from "@/lib/firebase/authService";
import { setUser, User } from "@/lib/Redux/localSlices/authSlice";
import { useTranslations } from "next-intl";
import { useRouter } from "@bprogress/next/app";

const ApplyVerifyLink = () => {
  const t = useTranslations("VerifyEmail");
  const searchParams = useSearchParams();
  const router = useRouter({ customRouter: useNextIntlRouter });
  const dispatch = useDispatch();

  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");
  const [isOobError, setIsOobError] = useState(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkCode = async () => {
      if (mode === "verifyEmail" && oobCode) {
        setStatus("loading");
        try {
          await checkActionCode(auth, oobCode);
          await applyActionCode(auth, oobCode);
          await reload(auth.currentUser!);
          await auth.currentUser?.getIdToken(true);
          const updatedUser = sanitizeFirebaseUser(
            auth.currentUser as unknown as User,
          );
          dispatch(setUser(updatedUser));

          setStatus("success");
          setMessage(t("ToastsOrMessages.VerifiedSuccessfully"));
          setTimeout(() => router.push("/profile"), 3000);
        } catch (error) {
          console.error(error);
          setIsOobError(true);
          setStatus("error");
          setMessage(t("ToastsOrMessages.Error"));
        }
      }
    };

    checkCode();
  }, [mode, oobCode, router, dispatch, t]);

  if (!oobCode || isOobError) {
    return (
      <PageSection className="flex flex-col justify-center items-center h-full">
        <p className="text-white text-lg border border-yellow-700 p-4 rounded shadow bg-gray-950">
          {t("ExpiredLink")}
        </p>
        <Link
          href="/profile"
          className="py-2 px-4 mt-2 bg-blue-700 hover:bg-blue-600 rounded-md shadow-lg text-white
            font-semibold transition duration-200"
        >
          {t("ContinueBtn")}
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
          {status === "loading" && (
            <h2 className="text-center text-2xl xs:text-3xl font-extrabold text-white">
              {t("Verifying")}
            </h2>
          )}
          <div className="flex flex-col justify-center items-center h-full w-full">
            {status === "loading" && (
              <SiSpinrilla className="animate-spin text-5xl" />
            )}
            {status === "success" && (
              <>
                <FaCheckCircle className="text-green-500 text-5xl" />
                <p className="text-white sm:text-lg p-4 rounded shadow bg-gray-950 text-center">
                  {message}
                </p>
                <Link
                  href="/profile"
                  className="py-2 px-4 mt-2 bg-blue-700 hover:bg-blue-600 rounded-md shadow-lg text-white
                    font-semibold transition duration-200"
                >
                  {t("ContinueBtn")}
                </Link>
              </>
            )}

            {status === "error" && (
              <>
                <FaTimesCircle className="text-red-500 text-5xl" />
                <p className="text-white sm:text-lg p-4 rounded shadow bg-gray-950 text-center">
                  {message}
                </p>
                <Link
                  href="/profile"
                  className="py-2 px-4 mt-2 bg-blue-700 hover:bg-blue-600 rounded-md shadow-lg text-white
                    font-semibold transition duration-200"
                >
                  {t("GoBackBtn")}
                </Link>
              </>
            )}
          </div>
        </div>
      </PageSection>
    </>
  );
};

export default ApplyVerifyLink;
