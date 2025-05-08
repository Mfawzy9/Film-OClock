import SearchPageComp from "@/app/_Components/SearchPageComp/SearchPageComp";
import { getTranslations } from "next-intl/server";
import { getSearchResults } from "../../../../../../helpers/tmdbRequests";
import { Metadata } from "next";
import { siteBaseUrl } from "../../../../../../helpers/serverBaseUrl";
import { WithContext, SearchResultsPage } from "schema-dts";

interface SearchPageProps {
  params: Promise<{
    locale: "en" | "ar";
    query: string;
  }>;
  searchParams: Promise<{
    page: string;
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
  const { page } = await searchParams;
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SearchPageComp
        page={pageNumber}
        query={decodedQuery}
        locale={locale}
        initialMovies={initialMovies}
        initialTvShows={initialTvShows}
        initialPeople={initialPeople}
      />
    </>
  );
};

export default SearchPage;
