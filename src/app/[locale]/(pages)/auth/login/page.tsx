import Login from "@/app/_Components/AuthComponents/Login/Login";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

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

const LoginPage = async () => {
  const cookiesStore = await cookies();
  const email = cookiesStore.get("email")?.value;
  const password = cookiesStore.get("password")?.value;
  return <Login email={email} password={password} />;
};

export default LoginPage;
