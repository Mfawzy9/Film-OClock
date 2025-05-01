import DiscoverShows from "@/app/_Components/DiscoverShows/DiscoverShows";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { siteBaseUrl } from "../../../../../../../helpers/serverBaseUrl";

interface Props {
  params: Promise<{ locale: "ar"; showType: "movie" | "tv" }>;
  searchParams: Promise<{
    page: string;
  }>;
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale, showType } = await params;
  const { page } = await searchParams;
  const pageNumber = Number(page) || 1;
  const isFirstPage = pageNumber === 1;
  const lastPage = pageNumber === 500;

  const pagination = {
    previous: isFirstPage
      ? undefined
      : `${siteBaseUrl}/${locale}/shows/all/?page=${pageNumber - 1}`,
    next: lastPage
      ? undefined
      : `${siteBaseUrl}/${locale}/shows/all/?page=${pageNumber + 1}`,
  };

  const alternates = {
    canonical: `${siteBaseUrl}/${locale}/shows/all/${showType}${isFirstPage ? "" : `?page=${pageNumber}`}`,
    languages: {
      en: `${siteBaseUrl}/${locale}/shows/all/${showType}${isFirstPage ? "" : `?page=${pageNumber}`}`,
      ar: `${siteBaseUrl}/${locale}/shows/all/${showType}${isFirstPage ? "" : `?page=${pageNumber}`}`,
    },
  };

  const t = await getTranslations({ locale, namespace: "MetaData" });
  const title =
    showType === "movie" ? t("AllMovies.Title") : t("AllTvShows.Title");
  const description =
    showType === "movie"
      ? t("AllMovies.Description")
      : t("AllTvShows.Description");

  return {
    title,
    description,
    pagination,
    alternates,
  };
}

const AllShows = async ({ params }: Props) => {
  const { showType } = await params;
  const t = await getTranslations("AllShows");
  const pageTitle =
    showType === "movie" ? t("PageTitleMovies") : t("PageTitleTvShows");

  if (showType !== "movie" && showType !== "tv") {
    return notFound();
  }

  return (
    <>
      <DiscoverShows showType={showType} pageTitle={pageTitle} />
    </>
  );
};

export default AllShows;
