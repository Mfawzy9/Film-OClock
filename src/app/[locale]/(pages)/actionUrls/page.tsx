import ResetPassword from "@/app/_Components/AuthComponents/ResetPassword/ResetPassword";
import formBg from "../../../../../public/images/formsBg.jpg";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import ApplyVerifyLink from "@/app/_Components/AuthComponents/ApplyVerifyLink/ApplyVerifyLink";
import RecoverEmail from "@/app/_Components/AuthComponents/RecoverEmail/RecoverEmail";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";

type Props = {
  params: Promise<{
    locale: "en" | "ar";
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

type MetaDataKey =
  | "actionUrls.recoverEmail"
  | "actionUrls.verifyEmail"
  | "actionUrls.resetPassword";

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const { mode } = await searchParams;
  const t = await getTranslations({ locale, namespace: "MetaData" });

  const baseKey: MetaDataKey = `actionUrls.${mode}` as MetaDataKey;

  const title = t(`${baseKey}.Title`);
  const description = t(`${baseKey}.Description`);

  return {
    title,
    description,
  };
}

const ActionUrls = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { mode } = await searchParams;
  const cookiesStore = await cookies();
  const sessionToken = cookiesStore.get("session")?.value;

  if (!mode) redirect("/");

  if (
    (mode === "resetPassword" && sessionToken) ||
    (mode === "verifyEmail" && !sessionToken)
  )
    redirect("/");

  return (
    <>
      <div className="relative min-h-screen w-full py-20 flex items-center justify-center">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={formBg}
            alt="Authentication background"
            fill
            className="object-cover object-top"
            quality={80}
            placeholder="blur"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>

        {/* Gradient at bottom */}
        <div
          className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent
            z-0"
        />

        {/* Content */}
        <div className="relative z-10 w-full">
          {mode === "resetPassword" && <ResetPassword />}
          {mode === "verifyEmail" && <ApplyVerifyLink />}
          {mode === "recoverEmail" && <RecoverEmail />}
        </div>
      </div>
    </>
  );
};

export default ActionUrls;
