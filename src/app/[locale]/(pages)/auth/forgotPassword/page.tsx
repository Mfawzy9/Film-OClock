import ForgotPassword from "@/app/_Components/AuthComponents/ForgotPassword/ForgotPassword";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{
    locale: "en" | "ar";
  }>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  const t = await getTranslations({ locale, namespace: "MetaData" });

  return {
    title: t("ForgotPassword.Title"),
    description: t("ForgotPassword.Description"),
  };
}
const ForgotPasswordPage = () => {
  return <ForgotPassword />;
};

export default ForgotPasswordPage;
