import Login from "@/app/_Components/AuthComponents/Login/Login";
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
    title: t("Login.Title"),
    description: t("Login.Description"),
  };
}

const LoginPage = () => {
  return <Login />;
};

export default LoginPage;
