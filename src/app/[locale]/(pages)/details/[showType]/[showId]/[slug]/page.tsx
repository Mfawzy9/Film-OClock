import MovieDetails from "@/app/_Components/MovieDetails/MovieDetails";
import PersonDetails from "@/app/_Components/PersonDetails/PersonDetails";
import TvDetails from "@/app/_Components/TvDetails/TvDetails";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  MovieDetailsResponse,
  PersonDetailsResponse,
  TvDetailsResponse,
} from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import {
  getImagesWithNextCache,
  getInitialDetailsDataWithNextCache,
} from "../../../../../../../lib/tmdbRequests";
import {
  getStaticShowParams,
  itemTypeMap,
  siteBaseUrl,
} from "../../../../../../../../helpers/serverHelpers";
import { notFound, redirect } from "next/navigation";
import {
  getShowTitle,
  nameToSlug,
} from "../../../../../../../../helpers/helpers";
import PageHeader from "@/app/_Components/PageHeader/PageHeader";
import {
  PreloadedQuery,
  RTKPreloader,
} from "@/app/_Components/helpers/RTKPreloader";

export const dynamicParams = true;
export const revalidate = 3600;
export async function generateStaticParams() {
  return getStaticShowParams({ includePeople: true });
}

type Props = {
  params: Promise<{
    locale: "en" | "ar";
    showId: number;
    showType: "movie" | "tv" | "person";
    slug: string;
  }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, showId, showType } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });

  const { initialData, initialTranslations } =
    await getInitialDetailsDataWithNextCache({
      locale,
      showId,
      showType,
    });
  const description = () => {
    if (showType === "person")
      return (initialData as PersonDetailsResponse)?.biography;
    if (initialData && initialTranslations) {
      const arabicSaOverview = initialTranslations.translations
        .find(
          (translation) =>
            translation.iso_639_1 === "ar" && translation.iso_3166_1 === "SA",
        )
        ?.data?.overview.trim();
      const arabicAeOverview = initialTranslations.translations
        .find(
          (translation) =>
            translation.iso_639_1 === "ar" && translation.iso_3166_1 === "AE",
        )
        ?.data?.overview.trim();
      return (
        arabicSaOverview ||
        arabicAeOverview ||
        (initialData as MovieDetailsResponse).overview
      );
    } else {
      return (initialData as MovieDetailsResponse).overview;
    }
  };

  if (!initialData)
    return {
      title: t("MainPage.Title"),
      description: t("MainPage.Description"),
    };

  const title =
    "original_title" in initialData
      ? `${getShowTitle({ isArabic: locale === "ar", show: initialData }) ?? initialData?.original_title} (${initialData?.release_date.split("-")[0]})`
      : "first_air_date" in initialData
        ? `${getShowTitle({ isArabic: locale === "ar", show: initialData }) ?? initialData?.original_name} (${initialData?.first_air_date.split("-")[0]})`
        : initialData?.name;

  const alternates = {
    canonical: `${siteBaseUrl}/${locale}/details/${showType}/${showId}/${nameToSlug(title)}`,
    languages: {
      en: `${siteBaseUrl}/en/details/${showType}/${showId}/${nameToSlug(title)}`,
      ar: `${siteBaseUrl}/ar/details/${showType}/${showId}/${nameToSlug(title)}`,
    },
  };

  return {
    title: `${title ?? t("MainPage.Title")} | ${t("MainPage.Title")}`,
    description: description() || t("MainPage.Description"),
    keywords:
      (initialData as MovieDetailsResponse | TvDetailsResponse).genres
        ?.map(({ name }) => name)
        .join(", ") ||
      (initialData as PersonDetailsResponse)?.movie_credits?.cast
        ?.map(({ original_title }) => original_title)
        .join(", ") ||
      t("Keywords"),
    openGraph: {
      url: `https://filmo-clock.vercel.app/${locale}/details/${showType}/${showId}/${nameToSlug(title)}`,
      title: title || t("MainPage.Title"),
      description: description() || t("MainPage.Description"),
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}${
            (initialData as MovieDetailsResponse | TvDetailsResponse)
              .backdrop_path ||
            (initialData as MovieDetailsResponse | TvDetailsResponse)
              .poster_path ||
            (initialData as PersonDetailsResponse).profile_path
          }`,
          width: 1280,
          height: 720,
          alt:
            (initialData as MovieDetailsResponse).title ||
            (initialData as TvDetailsResponse).name ||
            (initialData as PersonDetailsResponse).name,
        },
      ],
    },
    alternates,
    twitter: {
      description: description() || t("MainPage.Description"),
      title: title || t("MainPage.Title"),
      images: [
        `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}${
          (initialData as MovieDetailsResponse | TvDetailsResponse)
            .backdrop_path ||
          (initialData as MovieDetailsResponse | TvDetailsResponse)
            .poster_path ||
          (initialData as PersonDetailsResponse).profile_path
        }`,
      ],
    },
  };
}

const Details = async ({ params }: Props) => {
  const { showId, showType, locale, slug } = await params;
  const { initialData, initialTranslations } =
    await getInitialDetailsDataWithNextCache({
      locale,
      showId,
      showType,
    });

  let showImages = null;
  if (showType !== "person") {
    const { images } = await getImagesWithNextCache({
      showType,
      showId,
    });
    if (images) showImages = images;
  }

  if (initialData && showType !== "person") {
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
      redirect(`/${locale}/details/${showType}/${showId}/${encodedSlug}`);
    }
  }

  if (!["movie", "tv", "person"].includes(showType)) return notFound();

  const rtkArr = [
    showImages && {
      endpointName: "getImages",
      args: {
        showId,
        showType,
      },
      data: showImages,
    },
    {
      endpointName: "getMTDetails",
      args: {
        showId,
        showType,
        lang: showType === "person" ? locale : "en",
      },
      data: initialData,
    },
    initialTranslations && {
      endpointName: "getTranslations",
      args: {
        showId,
        showType,
      },
      data: initialTranslations,
    },
  ].filter(Boolean);

  return (
    <>
      {initialData && (
        <RTKPreloader preloadedQueries={rtkArr as PreloadedQuery[]} />
      )}
      {showType === "movie" && (
        <>
          {initialData && "original_title" in initialData && (
            <>
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

          <MovieDetails showId={showId} showType={showType} />
        </>
      )}
      {showType === "tv" && (
        <>
          {initialData && "original_name" in initialData && (
            <>
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
          <TvDetails showId={showId} showType={showType} />
        </>
      )}
      {showType === "person" && (
        <>
          {initialData && "known_for_department" in initialData && (
            <>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Person",
                    "@id": `${siteBaseUrl}/${locale}/details/${showType}/${showId}/${nameToSlug(initialData.name)}`,
                    name: initialData.name,
                    description: initialData.biography,
                    image: `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${initialData.profile_path}`,
                    birthDate: initialData.birthday,
                    url: `${siteBaseUrl}/${locale}/details/${showType}/${showId}/${nameToSlug(
                      initialData.name,
                    )}`,
                    jobTitle: initialData.known_for_department,
                    alternateName: initialData.also_known_as.join(", "),
                  }),
                }}
              />
              <article
                className="sr-only"
                itemScope
                itemType={itemTypeMap[showType]}
              >
                <h1 itemProp="name">{initialData.name}</h1>
                <h2 itemProp="jobTitle">{initialData.known_for_department}</h2>
                <p itemProp="alternateName">
                  {initialData.also_known_as.join(", ")}
                </p>
                <p itemProp="description">{initialData.biography}</p>
                <time itemProp="birthDate">{initialData.birthday}</time>
              </article>
            </>
          )}
          <PageHeader />
          <PersonDetails
            showId={showId}
            showType={showType}
            slug={slug}
            locale={locale}
          />
        </>
      )}
    </>
  );
};

export default Details;
