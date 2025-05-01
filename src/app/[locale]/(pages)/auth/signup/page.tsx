import Signup from "@/app/_Components/AuthComponents/Signup/SignUp";
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
    title: t("Register.Title"),
    description: t("Register.Description"),
  };
}

const SignupPage = () => {
  return <Signup />;
};

export default SignupPage;
