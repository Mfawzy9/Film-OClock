import PageHeader from "@/app/_Components/PageHeader/PageHeader";
import WatchMovie from "@/app/_Components/WatchMovie/WatchMovie";
import WatchTv from "@/app/_Components/WatchTv/WatchTv";
import { getTranslations } from "next-intl/server";
import { getInitialDetailsDataWithNextCache } from "../../../../../../../lib/tmdbRequests";
import {
  MovieDetailsResponse,
  TvDetailsResponse,
} from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import { Metadata } from "next";
import {
  MovieTranslationsResponse,
  TvTranslationsResponse,
} from "@/app/interfaces/apiInterfaces/translationsInterfaces";
import {
  getShowTitle,
  nameToSlug,
} from "../../../../../../../../helpers/helpers";
import { notFound, redirect } from "next/navigation";
import AdsModal from "@/app/_Components/AdsModal/AdsModal";
import { RTKPreloader } from "@/app/_Components/helpers/RTKPreloader";
import {
  getStaticShowParams,
  itemTypeMap,
  siteBaseUrl,
} from "../../../../../../../../helpers/serverHelpers";

interface WatchParams {
  params: Promise<{
    showId: number;
    showType: "movie" | "tv";
    locale: "en" | "ar";
    slug: string;
  }>;
  searchParams: Promise<{ season: number; episode: number }>;
}

export const dynamicParams = true;
export const revalidate = 3600;
export async function generateStaticParams() {
  return getStaticShowParams({ includePeople: false });
}

export async function generateMetadata({
  params,
  searchParams,
}: WatchParams): Promise<Metadata> {
  const { locale, showId, showType } = await params;

  const { season, episode } = await searchParams;

  const t = await getTranslations({ locale, namespace: "MetaData" });

  const { initialData, initialTranslations } =
    (await getInitialDetailsDataWithNextCache({
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
            initialData?.backdrop_path
          }`,
          width: 1280,
          height: 720,
          alt:
            showType === "movie" ? movieTitle : tvTitle || t("MainPage.Title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
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
  const { showId, showType, locale, slug } = await params;
  const sParams = await searchParams;
  const episode = sParams.episode ? Number((await searchParams).episode) : 1;
  const season = sParams.season ? Number((await searchParams).season) : 1;

  const { initialData, initialTranslations } =
    await getInitialDetailsDataWithNextCache({
      locale,
      showId,
      showType,
    });

  if (initialData) {
    const title =
      "original_title" in initialData
        ? (getShowTitle({
            isArabic: locale === "ar",
            show: initialData,
          }) ?? initialData.original_title)
        : "first_air_date" in initialData &&
          (getShowTitle({
            isArabic: locale === "ar",
            show: initialData,
          }) ??
            initialData.original_name);

    const correctSlug = title && nameToSlug(title);
    const decodedSlug = decodeURIComponent(slug);

    if (decodedSlug !== correctSlug) {
      const encodedSlug = encodeURIComponent(correctSlug);
      if (showType === "tv")
        redirect(
          `/${locale}/watch/${showType}/${showId}/${encodedSlug}?season=${season ?? 1}&episode=${episode ?? 1}`,
        );
      else redirect(`/${locale}/watch/${showType}/${showId}/${encodedSlug}`);
    }
  }

  if (showType === "tv" && (!sParams.season || !sParams.episode))
    redirect(
      `/${locale}/watch/${showType}/${showId}/${slug}?season=${season ?? 1}&episode=${episode ?? 1}`,
    );

  if (showType !== "movie" && showType !== "tv") {
    return notFound();
  }

  return (
    <>
      <RTKPreloader
        preloadedQueries={[
          {
            endpointName: "getMTDetails",
            args: {
              showId,
              showType,
            },
            data: initialData,
          },
        ]}
      />
      <PageHeader />
      <AdsModal />
      {showType === "movie" && (
        <>
          {initialData && "original_title" in initialData && (
            <>
              <header className="sr-only">
                <h1>
                  {locale === "ar"
                    ? `مشاهدة فيلم ${initialData.original_title}`
                    : `Watch Movie ${initialData.title}`}
                </h1>
              </header>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Movie",
                    "@id": `${siteBaseUrl}/${locale}/details/${showType}/${showId}/${nameToSlug(
                      locale === "ar"
                        ? initialData.original_title
                        : initialData.title,
                    )}`,
                    name: initialData.title ?? initialData.original_title,
                    description: initialData.overview,
                    image: `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${initialData.poster_path}`,
                    datePublished: initialData.release_date,
                    genre: initialData.genres?.map((g) => g.name),
                    aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: initialData.vote_average,
                      ratingCount: initialData.vote_count,
                    },
                    mainEntityOfPage: {
                      "@type": "WebPage",
                      "@id": `${siteBaseUrl}/${locale}/details/${showType}/${showId}/${nameToSlug(
                        locale === "ar"
                          ? initialData.original_title
                          : initialData.title,
                      )}`,
                    },
                    url: `${siteBaseUrl}/${locale}/details/${showType}/${showId}/${nameToSlug(
                      locale === "ar"
                        ? initialData.original_title
                        : initialData.title,
                    )}`,
                  }),
                }}
              />
              {initialData.belongs_to_collection && (
                <script
                  type="application/ld+json"
                  dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                      "@context": "https://schema.org",
                      "@id": `${siteBaseUrl}/${locale}/collection/${initialData.belongs_to_collection.id}/${initialData.belongs_to_collection.name}`,
                      "@type": "CollectionPage",
                      name: initialData.belongs_to_collection.name,
                      image: `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${initialData.belongs_to_collection.backdrop_path}`,
                    }),
                  }}
                />
              )}
              <article
                className="sr-only"
                itemScope
                itemType={itemTypeMap[showType]}
              >
                <h1 itemProp="name">
                  {locale === "ar"
                    ? initialData.original_title
                    : initialData.title}
                </h1>
                <p itemProp="description">
                  {locale === "en"
                    ? initialData.overview
                    : (initialTranslations?.translations.find(
                        (translation) =>
                          translation.iso_639_1 === "ar" &&
                          translation.data.overview,
                      )?.data.overview ?? initialData.overview)}
                </p>
                <p itemProp="genre">
                  {initialData.genres.map((g) => g.name).join(", ")}
                </p>
                <time itemProp="datePublished">{initialData.release_date}</time>
              </article>
            </>
          )}
          <WatchMovie
            showId={showId}
            showType={showType}
            movieTranslations={initialTranslations as MovieTranslationsResponse}
          />
        </>
      )}
      {showType === "tv" && (
        <>
          {initialData && "original_name" in initialData && (
            <>
              <header className="sr-only">
                <h1>
                  {locale === "ar"
                    ? `مشاهدة مسلسل ${initialData.original_name}`
                    : `Watch TV Series ${initialData.name}`}
                </h1>
              </header>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "TVSeries",
                    "@id": `${siteBaseUrl}/${locale}/details/${showType}/${showId}/${nameToSlug(
                      locale === "ar"
                        ? initialData.original_name
                        : initialData.name,
                    )}`,
                    name: initialData.name ?? initialData.original_name,
                    description: initialData.overview,
                    image: `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${initialData.poster_path}`,
                    datePublished: initialData.first_air_date,
                    genre: initialData.genres?.map((g) => g.name),
                    aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: initialData.vote_average,
                      ratingCount: initialData.vote_count,
                    },
                    mainEntityOfPage: {
                      "@type": "WebPage",
                      "@id": `${siteBaseUrl}/${locale}/details/${showType}/${showId}/${nameToSlug(
                        locale === "ar"
                          ? initialData.original_name
                          : initialData.name,
                      )}`,
                    },
                    url: `${siteBaseUrl}/${locale}/details/${showType}/${showId}/${nameToSlug(
                      locale === "ar"
                        ? initialData.original_name
                        : initialData.name,
                    )}`,
                  }),
                }}
              />
              <article
                className="sr-only"
                itemScope
                itemType={itemTypeMap[showType]}
              >
                <h1 itemProp="name">
                  {locale === "ar"
                    ? initialData.original_name
                    : initialData.name}
                </h1>
                <p itemProp="description">
                  {locale === "en"
                    ? initialData.overview
                    : (initialTranslations?.translations.find(
                        (translation) =>
                          translation.iso_639_1 === "ar" &&
                          translation.data.overview,
                      )?.data.overview ?? initialData.overview)}
                </p>
                <p itemProp="genre">
                  {initialData.genres.map((g) => g.name).join(", ")}
                </p>
                <time itemProp="datePublished">
                  {initialData.first_air_date}
                </time>
              </article>
            </>
          )}
          <WatchTv
            showId={showId}
            showType={showType}
            episode={episode}
            season={season}
            tvShowTranslations={initialTranslations as TvTranslationsResponse}
          />
        </>
      )}
    </>
  );
};

export default WatchPage;
