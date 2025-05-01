import TrendingShows from "@/app/_Components/TrendingShows/TrendingShows";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ locale: "ar"; showType: "movie" | "tv" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, showType } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });
  const title =
    showType === "movie"
      ? t("TrendingMovies.Title")
      : t("TrendingTvShows.Title");
  const description =
    showType === "movie"
      ? t("TrendingMovies.Description")
      : t("TrendingTvShows.Description");

  return {
    title,
    description,
  };
}

const TrendingShowsPage = async ({ params }: Props) => {
  const { showType } = await params;
  if (showType !== "movie" && showType !== "tv") {
    return notFound();
  }
  return <TrendingShows />;
};

export default TrendingShowsPage;
