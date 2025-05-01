import DynamicTopRatedShows from "@/app/_Components/TopRated/TopRated";
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
      ? t("TopRatedMovies.Title")
      : t("TopRatedTvShows.Title");
  const description =
    showType === "movie"
      ? t("TopRatedMovies.Description")
      : t("TopRatedTvShows.Description");

  return {
    title,
    description,
  };
}

const TopRatedPage = async ({ params }: Props) => {
  const { showType } = await params;
  if (showType !== "movie" && showType !== "tv") {
    return notFound();
  }
  return <DynamicTopRatedShows />;
};

export default TopRatedPage;
