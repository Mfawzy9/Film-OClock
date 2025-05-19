import SearchPageComp from "@/app/_Components/SearchPageComp/SearchPageComp";
import { getTranslations } from "next-intl/server";
import { getSearchResults } from "../../../../../lib/tmdbRequests";
import { Metadata } from "next";
import {
  itemTypeMap,
  siteBaseUrl,
} from "../../../../../../helpers/serverHelpers";
import { WithContext, SearchResultsPage } from "schema-dts";
import {
  PreloadedQuery,
  RTKPreloader,
} from "@/app/_Components/helpers/RTKPreloader";

interface SearchPageProps {
  params: Promise<{
    locale: "en" | "ar";
    query: string;
  }>;
  searchParams: Promise<{
    page: string;
    results: string;
  }>;
}

const metadataBase = new URL(siteBaseUrl);

// Helper function to generate common metadata fields
const generateSearchMetadata = async (
  locale: "en" | "ar",
  query: string,
  pageNumber: number,
) => {
  const decodedQuery = decodeURIComponent(query);
  const t = await getTranslations({ locale, namespace: "MetaData" });
  const isFirstPage = pageNumber === 1;

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

  const canonicalUrl = `/${locale}/search/${encodeURIComponent(query)}${isFirstPage ? "" : `?page=${pageNumber}`}`;

  return {
    title,
    description,
    canonicalUrl,
    alternates: {
      canonical: `${siteBaseUrl}/${canonicalUrl}`,
      languages: {
        en: `${siteBaseUrl}/en/search/${encodeURIComponent(query)}${isFirstPage ? "" : `?page=${pageNumber}`}`,
        ar: `${siteBaseUrl}/ar/search/${encodeURIComponent(query)}${isFirstPage ? "" : `?page=${pageNumber}`}`,
      },
    },
    pagination: {
      previous: isFirstPage
        ? undefined
        : `${siteBaseUrl}/${locale}/search/${encodeURIComponent(query)}?page=${pageNumber - 1}`,
      next: `${siteBaseUrl}/${locale}/search/${encodeURIComponent(query)}?page=${pageNumber + 1}`,
    },
  };
};

export async function generateMetadata({
  params,
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { locale, query } = await params;
  const { page } = await searchParams;
  const pageNumber = Number(page) || 1;

  const { title, description, canonicalUrl, alternates, pagination } =
    await generateSearchMetadata(locale, query, pageNumber);

  return {
    title,
    description,
    metadataBase,
    alternates,
    pagination,
    openGraph: {
      title: title,
      description: description,
      url: `${metadataBase}/${canonicalUrl}`,
      siteName: "FilmO'Clock",
      locale,
      images: [
        {
          url: `${metadataBase}/logo.webp`,
          width: 800,
          height: 600,
          alt: "FilmO'Clock",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
      site: "@filmO'Clock",
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
  };
}

const SearchPage = async ({ params, searchParams }: SearchPageProps) => {
  const { locale, query } = await params;
  const { page, results } = await searchParams;
  const pageNumber = Number(page) || 1;
  const decodedQuery = decodeURIComponent(query);

  const { initialMovies, initialTvShows, initialPeople } =
    await getSearchResults({
      locale: "en",
      query,
      page: pageNumber,
    });

  const { title, description, canonicalUrl } = await generateSearchMetadata(
    locale,
    query,
    pageNumber,
  );

  const structuredData: WithContext<SearchResultsPage> = {
    "@id": `${metadataBase}/${canonicalUrl}`,
    "@context": "https://schema.org",
    "@type": "SearchResultsPage",
    name: title,
    description: description,
    url: new URL(canonicalUrl, metadataBase).toString(),
    inLanguage: locale,
    potentialAction: {
      "@type": "SearchAction",
      target: `${metadataBase}/${locale}/search?query={search_term_string}`,
      query: "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "FilmO'Clock",
      url: metadataBase.toString(),
      logo: {
        "@type": "ImageObject",
        url: `${metadataBase}/logo.webp`,
        width: {
          "@type": "QuantitativeValue",
          value: 512,
          unitText: "PX",
        },
        height: {
          "@type": "QuantitativeValue",
          value: 512,
          unitText: "PX",
        },
        alternateName: "FilmO'Clock",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${metadataBase}/${canonicalUrl}`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Search",
          item: `${metadataBase}/${locale}/search`,
        },
      ],
    },
  };

  const rtkArr = [
    initialMovies && {
      endpointName: "getSearchMovies",
      args: { query: decodedQuery, page: pageNumber },
      data: initialMovies,
    },
    initialTvShows && {
      endpointName: "getSearchTvShows",
      args: { query: decodedQuery, page: pageNumber },
      data: initialTvShows,
    },
    initialPeople && {
      endpointName: "getSearchPeople",
      args: { query: decodedQuery, page: pageNumber },
      data: initialPeople,
    },
  ].filter(Boolean);

  return (
    <>
      <RTKPreloader preloadedQueries={rtkArr as PreloadedQuery[]} />
      {initialMovies && (
        <article className="sr-only">
          {initialMovies.results.map((movie) => (
            <div itemScope itemType={itemTypeMap["movie"]} key={movie.id}>
              <h1 itemProp="name">
                {locale === "ar" ? movie.original_title : movie.title}
              </h1>
              <p itemProp="description">{movie.overview}</p>
              <time itemProp="datePublished">{movie.release_date}</time>
            </div>
          ))}
        </article>
      )}
      {initialTvShows && (
        <article className="sr-only">
          {initialTvShows.results.map((tvShow) => (
            <div itemScope itemType={itemTypeMap["tv"]} key={tvShow.id}>
              <h1 itemProp="name">
                {locale === "ar" ? tvShow.original_name : tvShow.name}
              </h1>
              <p itemProp="description">{tvShow.overview}</p>
              <time itemProp="datePublished">{tvShow.first_air_date}</time>
            </div>
          ))}
        </article>
      )}
      {initialPeople && (
        <article className="sr-only">
          {initialPeople.results.map((person) => (
            <div itemScope itemType={itemTypeMap["person"]} key={person.id}>
              <h1 itemProp="name">{person.name}</h1>
              <h2 itemProp="alternateName">{person.original_name}</h2>
              <h2 itemProp="jobTitle">{person.known_for_department}</h2>
              <p itemProp="alternateName">{person.known_for.join(", ")}</p>
              <p itemProp="gender">{person.gender}</p>
            </div>
          ))}
        </article>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <article
        className="sr-only"
        itemScope
        itemType="https://schema.org/WebPage"
      >
        <h1 itemProp="name">{title}</h1>
        <p itemProp="description">{description}</p>
      </article>
      <SearchPageComp
        page={pageNumber}
        results={results}
        query={decodedQuery}
      />
    </>
  );
};

export default SearchPage;
