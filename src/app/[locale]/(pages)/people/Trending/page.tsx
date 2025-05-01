import TrendingPpl from "@/app/_Components/TrendingPpl/TrendingPpl";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: "ar" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });

  return {
    title: t("TrendingPeople.Title"),
    description: t("TrendingPeople.Description"),
  };
}

const TrendingPplPage = () => {
  return <TrendingPpl />;
};

export default TrendingPplPage;
