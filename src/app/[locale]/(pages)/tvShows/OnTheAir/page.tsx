import OnTheAir from "@/app/_Components/OnTheAir/OnTheAir";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: "ar" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });

  return {
    title: t("OnTheAirTvShows.Title"),
    description: t("OnTheAirTvShows.Description"),
  };
}

const OnTheAirPage = () => {
  return <OnTheAir />;
};

export default OnTheAirPage;
