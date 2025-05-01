import AiringToday from "@/app/_Components/AiringToday/AiringToday";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: "ar" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });

  return {
    title: t("AiringTodayTvShows.Title"),
    description: t("AiringTodayTvShows.Description"),
  };
}

const AiringTodayPage = () => {
  return <AiringToday />;
};

export default AiringTodayPage;
