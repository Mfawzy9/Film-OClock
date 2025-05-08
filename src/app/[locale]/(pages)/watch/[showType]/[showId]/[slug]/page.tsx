import PageHeader from "@/app/_Components/PageHeader/PageHeader";
import WatchMovie from "@/app/_Components/WatchMovie/WatchMovie";
import WatchTv from "@/app/_Components/WatchTv/WatchTv";
import { getTranslations } from "next-intl/server";
import { getInitialDetailsDataCachedWithMap } from "../../../../../../../../helpers/tmdbRequests";
import {
  MovieDetailsResponse,
  TvDetailsResponse,
} from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import { Metadata } from "next";
import {
  MovieTranslationsResponse,
  TvTranslationsResponse,
} from "@/app/interfaces/apiInterfaces/translationsInterfaces";
import { nameToSlug } from "../../../../../../../../helpers/helpers";
import { notFound } from "next/navigation";
import AdsModal from "@/app/_Components/AdsModal/AdsModal";

interface WatchParams {
  params: Promise<{
    showId: number;
    showType: "movie" | "tv";
    locale: "en" | "ar";
  }>;
  searchParams: Promise<{ season: number; episode: number }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: WatchParams): Promise<Metadata> {
  const { locale, showId, showType } = await params;

  const { season, episode } = await searchParams;

  const t = await getTranslations({ locale, namespace: "MetaData" });

  const { initialData, initialTranslations } =
    (await getInitialDetailsDataCachedWithMap({
      locale,
      showId,
      showType,
    })) as {
      initialData: MovieDetailsResponse | TvDetailsResponse;
      initialTranslations: MovieTranslationsResponse | TvTranslationsResponse;
    };

  const description = () => {
    if (initialData && initialTranslations) {
      const arabicSaOverview = initialTranslations.translations.find(
        (translation) =>
          translation.iso_639_1 === "ar" && translation.iso_3166_1 === "SA",
      )?.data?.overview;
      const arabicAeOverview = initialTranslations.translations.find(
        (translation) =>
          translation.iso_639_1 === "ar" && translation.iso_3166_1 === "AE",
      )?.data?.overview;
      return arabicSaOverview || arabicAeOverview || initialData.overview;
    } else {
      return initialData.overview;
    }
  };

  if (!initialData)
    return {
      title: t("MainPage.Title"),
      description: t("MainPage.Description"),
    };

  const title =
    "original_title" in initialData
      ? (initialData?.title ?? initialData?.original_title)
      : (initialData?.name ?? initialData?.original_name);

  const tvTitle = t("WatchTv.Title", { TvName: title, s: season, e: episode });
  const movieTitle = t("WatchMovie.Title", { MovieName: title });

  return {
    title: showType === "movie" ? movieTitle : tvTitle,
    description: description() || t("MainPage.Description"),
    keywords:
      initialData.genres?.map(({ name }) => name).join(", ") || t("Keywords"),
    openGraph: {
      url: `https://filmo-clock.vercel.app/${locale}/details/${showType}/${showId}/${nameToSlug(title)}`,
      title: showType === "movie" ? movieTitle : tvTitle || t("MainPage.Title"),
      description: description() || t("MainPage.Description"),
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${
            initialData.backdrop_path
          }`,
          width: 1280,
          height: 720,
          alt:
            showType === "movie" ? movieTitle : tvTitle || t("MainPage.Title"),
        },
      ],
    },
  };
}

const WatchPage = async ({ params, searchParams }: WatchParams) => {
  const { showId, showType, locale } = await params;
  const { episode, season } = await searchParams;

  const { initialData, initialTranslations } =
    await getInitialDetailsDataCachedWithMap({
      locale,
      showId,
      showType,
    });

  if (showType !== "movie" && showType !== "tv") {
    return notFound();
  }

  return (
    <>
      <PageHeader />
      <AdsModal />
      {showType === "movie" && (
        <WatchMovie
          showId={showId}
          showType={showType}
          initialData={initialData as MovieDetailsResponse}
          initialTranslations={initialTranslations as MovieTranslationsResponse}
        />
      )}
      {showType === "tv" && (
        <WatchTv
          showId={showId}
          showType={showType}
          episode={Number(episode) ?? 1}
          season={Number(season) ?? 1}
          initialData={initialData as TvDetailsResponse}
          initialTranslations={initialTranslations as TvTranslationsResponse}
        />
      )}
    </>
  );
};

export default WatchPage;
