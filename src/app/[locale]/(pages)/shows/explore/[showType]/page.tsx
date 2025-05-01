import Explore from "@/app/_Components/Explore/Explore";
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
      showType === "movie" ? "Explore.Movies.Title" : "Explore.TvShows.Title",
    ),
    description: t(`Explore.Description`),
  };
}

const ExplorePage = async ({ params }: Props) => {
  const { showType } = await params;
  if (showType !== "movie" && showType !== "tv") {
    return notFound();
  }
  return <Explore />;
};

export default ExplorePage;
