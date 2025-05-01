import UpcomingMovies from "@/app/_Components/UpcomingMovies/UpcomingMovies";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: "ar" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });

  return {
    title: t("UpcomingMovies.Title"),
    description: t("UpcomingMovies.Description"),
  };
}

const UpcomingMoviesPage = () => {
  return <UpcomingMovies />;
};

export default UpcomingMoviesPage;
