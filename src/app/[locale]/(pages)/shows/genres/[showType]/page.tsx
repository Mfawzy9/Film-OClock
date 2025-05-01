import GenresComp from "@/app/_Components/Genres/GenresComp";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ locale: "ar"; showType: "movie" | "tv" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, showType } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });
  return {
    title: t(
      showType === "movie"
        ? "GenresPage.MoviesTitle"
        : "GenresPage.TvShowsTitle",
    ),
    description: t(
      showType === "movie"
        ? "GenresPage.MoviesDescription"
        : "GenresPage.TvShowsDescription",
    ),
  };
}

const GenresPage = async ({ params }: Props) => {
  const { showType } = await params;
  if (showType !== "movie" && showType !== "tv") {
    return notFound();
  }
  return <GenresComp />;
};

export default GenresPage;
