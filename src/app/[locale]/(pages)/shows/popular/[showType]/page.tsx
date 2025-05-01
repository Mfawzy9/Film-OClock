import PopularShows from "@/app/_Components/PopularShows/PopularShows";
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
    showType === "movie" ? t("PopularMovies.Title") : t("PopularTvShows.Title");
  const description =
    showType === "movie"
      ? t("PopularMovies.Description")
      : t("PopularTvShows.Description");

  return {
    title,
    description,
  };
}

const PopularShowsPage = async ({ params }: Props) => {
  const { showType } = await params;
  if (showType !== "movie" && showType !== "tv") {
    return notFound();
  }
  return <PopularShows />;
};

export default PopularShowsPage;
