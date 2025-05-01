import SearchPageComp from "@/app/_Components/SearchPageComp/SearchPageComp";
import { getTranslations } from "next-intl/server";
import { getSearchResults } from "../../../../../../helpers/tmdbRequests";
import { Metadata } from "next";
import { siteBaseUrl } from "../../../../../../helpers/serverBaseUrl";

interface SearchPageProps {
  params: Promise<{
    locale: "en" | "ar";
    query: string;
  }>;
  searchParams: Promise<{
    page: string;
  }>;
}

export const metadataBase = new URL("https://film-oclock.vercel.app/");

export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { locale, query } = await params;
  const { page } = await searchParams;
  const decodedQuery = decodeURIComponent(query);
  const t = await getTranslations({ locale, namespace: "MetaData" });

  const pageNumber = Number(page) || 1;
  const isFirstPage = pageNumber === 1;

  const canonicalUrl = isFirstPage
    ? `/${locale}/search/${encodeURIComponent(query)}`
    : `/${locale}/search/${encodeURIComponent(query)}?page=${pageNumber}`;

  const title = isFirstPage
    ? t("SearchResults.title", { query: decodedQuery })
    : t("SearchResults.titleWithPage", {
        query: decodedQuery,
        page: pageNumber,
      });

  const description = isFirstPage
    ? t("SearchResults.description", { query: decodedQuery })
    : t("SearchResults.descriptionWithPage", {
        query: decodedQuery,
        page: pageNumber,
      });

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: title,
    description: description,
    url: `${metadataBase}${canonicalUrl}`,
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${metadataBase}/${locale}/search?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const alternates = {
    canonical: `${siteBaseUrl}/${locale}/search/${encodeURIComponent(query)}${isFirstPage ? "" : `?page=${pageNumber}`}`,
    languages: {
      en: `${siteBaseUrl}/en/search/${encodeURIComponent(query)}${isFirstPage ? "" : `?page=${pageNumber}`}`,
      ar: `${siteBaseUrl}/ar/search/${encodeURIComponent(query)}${isFirstPage ? "" : `?page=${pageNumber}`}`,
    },
  };

  const pagination = {
    previous: isFirstPage
      ? undefined
      : `${siteBaseUrl}/${locale}/search/${encodeURIComponent(query)}?page=${pageNumber - 1}`,
    next: `${siteBaseUrl}/${locale}/search/${encodeURIComponent(query)}?page=${pageNumber + 1}`,
  };

  return {
    title,
    pagination,
    description,
    metadataBase,
    alternates,
    openGraph: {
      title,
      description,
      url: `${metadataBase}${canonicalUrl}`,
      siteName: "FilmO'Clock",
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "script:ld+json": JSON.stringify(structuredData),
    },
  };
}

const SearchPage = async ({ params, searchParams }: SearchPageProps) => {
  const { locale, query } = await params;
  const { page: stringPage } = await searchParams;
  const decodedQuery = decodeURIComponent(query);

  const page = +stringPage || 1;

  const { initialMovies, initialTvShows, initialPeople } =
    await getSearchResults({
      locale: "en",
      query,
      page: page,
    });

  return (
    <SearchPageComp
      page={page}
      query={decodedQuery}
      locale={locale}
      initialMovies={initialMovies}
      initialTvShows={initialTvShows}
      initialPeople={initialPeople}
    />
  );
};

export default SearchPage;

// import SearchPageComp from "@/app/_Components/SearchPageComp/SearchPageComp";
// import { getTranslations } from "next-intl/server";
// import { getSearchResults } from "../../../../../../helpers/tmdbRequests";
// import { Metadata } from "next";

// interface SearchPageProps {
//   params: Promise<{
//     locale: "en" | "ar";
//     query: string;
//   }>;
//   searchParams: Promise<{
//     page: string;
//   }>;
// }

// export async function generateMetadata({
//   params,
//   searchParams,
// }: SearchPageProps): Promise<Metadata> {
//   const { locale, query } = await params;
//   const { page } = await searchParams;
//   const decodedQuery = decodeURIComponent(query);
//   const t = await getTranslations({ locale, namespace: "MetaData" });

//   const pageNumber = Number(page) || 1;
//   const isFirstPage = pageNumber === 1;

//   const canonicalUrl = isFirstPage
//     ? `/${locale}/search/${encodeURIComponent(query)}`
//     : `/${locale}/search/${encodeURIComponent(query)}?page=${pageNumber}`;

//   return {
//     title: isFirstPage
//       ? t("SearchResults.title", { query: decodedQuery })
//       : t("SearchResults.titleWithPage", {
//           query: decodedQuery,
//           page: pageNumber,
//         }),
//     description: isFirstPage
//       ? t("SearchResults.description", { query: decodedQuery })
//       : t("SearchResults.descriptionWithPage", {
//           query: decodedQuery,
//           page: pageNumber,
//         }),
//     alternates: {
//       canonical: canonicalUrl,
//     },
//   };
// }

// const SearchPage = async ({ params, searchParams }: SearchPageProps) => {
//   const { locale, query } = await params;
//   const { page: stringPage } = await searchParams;
//   const decodedQuery = decodeURIComponent(query);

//   const page = +stringPage || 1;

//   const { initialMovies, initialTvShows, initialPeople } =
//     await getSearchResults({
//       locale: "en",
//       query,
//       page: page,
//     });

//   return (
//     <SearchPageComp
//       page={page}
//       query={decodedQuery}
//       locale={locale}
//       initialMovies={initialMovies}
//       initialTvShows={initialTvShows}
//       initialPeople={initialPeople}
//     />
//   );
// };

// export default SearchPage;
