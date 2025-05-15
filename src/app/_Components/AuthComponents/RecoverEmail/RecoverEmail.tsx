"use client";
import { auth } from "@/lib/firebase/config";
import { applyActionCode, checkActionCode } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  useSearchParams,
  useRouter as useNextIntlRouter,
} from "next/navigation";
import PageSection from "../../PageSection/PageSection";
import { Link } from "@/i18n/navigation";
import { signOutUser } from "@/lib/firebase/authService";
import { useTranslations } from "next-intl";
import { useRouter } from "@bprogress/next/app";
import { FaCheckCircle } from "@react-icons/all-files/fa/FaCheckCircle";
import { FaTimesCircle } from "@react-icons/all-files/fa/FaTimesCircle";
import { SiSpinrilla } from "@react-icons/all-files/si/SiSpinrilla";

const RecoverEmail = () => {
  const t = useTranslations("Navbar.UserMenu");
  const tRecover = useTranslations("RecoverEmail");
  const searchParams = useSearchParams();
  const router = useRouter({ customRouter: useNextIntlRouter });
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");
  const [isOobError, setIsOobError] = useState(false);

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    const handleRecoverEmail = async () => {
      if (mode === "recoverEmail" && oobCode) {
        setStatus("loading");
        try {
          await checkActionCode(auth, oobCode);
          await applyActionCode(auth, oobCode);

          setStatus("success");
          setMessage(tRecover("Success"));
          signOutUser(t).then(() => {
            setTimeout(() => router.push("/auth/login"), 2000);
          });
        } catch (error) {
          console.error("Recovery error:", error);
          setStatus("error");
          setIsOobError(true);
          setMessage(tRecover("ErrorLink"));
        }
      }
    };

    handleRecoverEmail();
  }, [mode, oobCode, router, t, tRecover]);

  if (!oobCode || isOobError) {
    return (
      <PageSection className="flex flex-col justify-center items-center h-full">
        <p className="text-white text-lg border border-yellow-700 p-4 rounded shadow bg-gray-950">
          {tRecover("OobError")}
        </p>
        <Link
          href="/auth/login"
          className="py-2 px-4 mt-2 bg-blue-700 hover:bg-blue-600 rounded-md shadow-lg text-white
            font-semibold transition duration-200"
        >
          {tRecover("CancelBtn")}
        </Link>
      </PageSection>
    );
  }

  return (
    <PageSection className="flex justify-center items-center h-full">
      <div className="max-w-md w-full bg-gray-950 rounded-xl p-6 space-y-6 text-center shadow-blueGlow">
        <h2 className="text-white text-2xl font-bold">
          {status === "loading" ? "Processing..." : message}
        </h2>

        {status === "loading" && (
          <SiSpinrilla className="animate-spin text-5xl mx-auto" />
        )}

        {status === "success" && (
          <>
            <FaCheckCircle className="text-green-500 text-5xl mx-auto" />
            <p className="text-white">{tRecover("Redirecting")}</p>
          </>
        )}

        {status === "error" && (
          <>
            <FaTimesCircle className="text-red-500 text-5xl mx-auto" />
            <p className="text-white">{message}</p>
            <Link
              onClick={() => signOutUser(t)}
              href="/auth/login"
              className="inline-block mt-4 px-4 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded
                shadow"
            >
              {tRecover("BacktoLoginPage")}
            </Link>
          </>
        )}
      </div>
    </PageSection>
  );
};

export default RecoverEmail;
