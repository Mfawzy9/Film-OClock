import NowPlayingMovies from "@/app/_Components/NowPlayingMovies/NowPlayingMovies";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface Props {
  params: Promise<{ locale: "ar" }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });

  return {
    title: t("NowPlayingMovies.Title"),
    description: t("NowPlayingMovies.Description"),
  };
}

const NowPlayingMoviesPage = () => {
  return <NowPlayingMovies />;
};

export default NowPlayingMoviesPage;
