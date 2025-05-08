import MovieCollectionComp from "@/app/_Components/MovieCollectionComp/MovieCollectionComp";
import { getTranslations } from "next-intl/server";
import { getMovieCollectionWithNextCache } from "../../../../../../../helpers/tmdbRequests";
import { Metadata } from "next";

interface params {
  params: Promise<{
    locale: "en" | "ar";
    collectionId: string;
    slug: string;
  }>;
}

export async function generateMetadata({ params }: params): Promise<Metadata> {
  const { locale, collectionId, slug } = await params;
  const t = await getTranslations({ locale, namespace: "MetaData" });
  const { collectionDetails, collectionTranslations } =
    await getMovieCollectionWithNextCache({ collectionId, locale });

  const title = () => {
    if (collectionDetails && collectionTranslations) {
      const arabicSaTitle = collectionTranslations.translations.find(
        (translation) =>
          translation.iso_639_1 === "ar" && translation.iso_3166_1 === "SA",
      )?.data?.title;
      const arabicAeTitle = collectionTranslations.translations.find(
        (translation) =>
          translation.iso_639_1 === "ar" && translation.iso_3166_1 === "AE",
      )?.data?.title;
      return arabicSaTitle || arabicAeTitle || collectionDetails.name;
    } else {
      return collectionDetails?.name;
    }
  };

  const description = () => {
    if (collectionDetails && collectionTranslations) {
      const arabicSaOverview = collectionTranslations.translations
        .find(
          (translation) =>
            translation.iso_639_1 === "ar" && translation.iso_3166_1 === "SA",
        )
        ?.data?.overview.trim();
      const arabicAeOverview = collectionTranslations.translations
        .find(
          (translation) =>
            translation.iso_639_1 === "ar" && translation.iso_3166_1 === "AE",
        )
        ?.data?.overview.trim();
      return arabicSaOverview || arabicAeOverview || collectionDetails.overview;
    } else {
      return collectionDetails?.overview || t("MainPage.Description");
    }
  };

  return {
    title: `${title()} | ${t("MainPage.Title")}` || t("MainPage.Title"),
    description: description(),
    keywords:
      collectionDetails?.parts?.map((part) => part.title).join(",") ||
      t("Keywords")
        .split(",")
        .map((k) => k.trim()),
    openGraph: {
      title: collectionDetails?.name || t("MainPage.Title"),
      description: collectionDetails?.overview || t("MainPage.Description"),
      images: [
        {
          url: `https://image.tmdb.org/t/p/w500${collectionDetails?.poster_path}`,
          width: 300,
          height: 450,
          alt: collectionDetails?.name || t("MainPage.Title"),
        },
        {
          url: `https://image.tmdb.org/t/p/w500${collectionDetails?.backdrop_path}`,
          width: 1000,
          height: 600,
          alt: collectionDetails?.name || t("MainPage.Title"),
        },
      ],
    },
    verification: {
      google: "4fxUEEpS5EPAOcFpt1p5J6eTAUm04ByRFl4q3b0EaGY",
    },
    alternates: {
      canonical: `/${locale}/collection/${collectionId}/${slug}/`,
      languages: {
        "en-US": `/en/collection/${collectionId}/${slug}/`,
        "ar-EG": `/ar/collection/${collectionId}/${slug}/`,
      },
    },
  };
}

const MovieCollectionPage = async ({ params }: params) => {
  const { locale, collectionId } = await params;
  const { collectionDetails, collectionTranslations } =
    await getMovieCollectionWithNextCache({ collectionId, locale });
  return (
    <MovieCollectionComp
      collectionDetails={collectionDetails}
      collectionTranslations={collectionTranslations}
      locale={locale}
    />
  );
};

export default MovieCollectionPage;
