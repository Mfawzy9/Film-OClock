import {
  MovieDetailsResponse,
  PersonDetailsResponse,
  TvDetailsResponse,
} from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import { MovieCollectionResponse } from "@/app/interfaces/apiInterfaces/movieCollectionInterfaces";
import { MovieCollectionTranslationsResponse } from "@/app/interfaces/apiInterfaces/movieCollectionTranslationsInterfaces";
import {
  TvTranslationsResponse,
  MovieTranslationsResponse,
} from "@/app/interfaces/apiInterfaces/translationsInterfaces";
import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
const API_KEY = process.env.TMDB_API_KEY!;
const ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;

const MAX_CACHE_ITEMS = 200; // Limit: only keep 200 items
const CACHE_TTL = 1000 * 60 * 60; // cache for 1 hour (Time To Live)

type CacheItem<T> = {
  promise: Promise<T>;
  timestamp: number;
};

const cacheMap = new Map<string, CacheItem<any>>();
// getOrSet
export function getOrSet<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const cached = cacheMap.get(key);

  if (cached) {
    const isExpired = Date.now() - cached.timestamp > CACHE_TTL;
    if (!isExpired) {
      return cached.promise;
    } else {
      cacheMap.delete(key); // Remove expired entry
    }
  }

  // If cache is full, delete the oldest item (FIFO(First In, First Out) policy)
  if (cacheMap.size >= MAX_CACHE_ITEMS) {
    const oldestKey = cacheMap.keys().next().value;
    if (oldestKey) cacheMap.delete(oldestKey);
  }

  const promise = fn();
  cacheMap.set(key, { promise, timestamp: Date.now() });

  return promise;
}

// fetchShowDetails
export const fetchShowDetails = async ({
  showId,
  showType,
  locale,
}: {
  showId: number;
  showType: "movie" | "tv" | "person";
  locale: "en" | "ar";
}): Promise<
  MovieDetailsResponse | PersonDetailsResponse | TvDetailsResponse | null
> => {
  const lang = showType === "person" ? locale : "en";
  const res = await fetch(
    `${BASE_URL}${showType}/${showId}?api_key=${API_KEY}&append_to_response=videos,images,external_ids,credits,recommendations,reviews,similar,combined_credits,movie_credits,tv_credits&language=${lang}`,
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      next: { revalidate: 3600, tags: [`details-${showId}-${showType}`] },
    },
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data as
    | MovieDetailsResponse
    | PersonDetailsResponse
    | TvDetailsResponse;
};

// fetchTranslations
export const fetchTranslations = async ({
  showId,
  showType,
}: {
  showId: number;
  showType: "movie" | "tv" | "person";
}): Promise<TvTranslationsResponse | MovieTranslationsResponse | null> => {
  const res = await fetch(
    `${BASE_URL}${showType}/${showId}/translations?api_key=${API_KEY}`,
    {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      next: { revalidate: 3600, tags: [`${showType}-translations-${showId}`] },
    },
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data as TvTranslationsResponse | MovieTranslationsResponse;
};

// getInitialDetailsData with react cache
export const getInitialDetailsDataWithReactCache = reactCache(
  async ({
    showId,
    showType,
    locale,
  }: {
    showId: number;
    showType: "movie" | "tv" | "person";
    locale: "en" | "ar";
  }) => {
    const initialData = await fetchShowDetails({
      showId,
      showType,
      locale: showType === "person" ? locale : "en",
    });

    let initialTranslations = null;
    if (locale === "ar" && (showType === "movie" || showType === "tv")) {
      initialTranslations = await fetchTranslations({ showId, showType });
    }

    return { initialData, initialTranslations };
  },
);

// getInitialDetailsData with next cache
export const getInitialDetailsDataWithNextCache = ({
  showId,
  showType,
  locale,
}: {
  showId: number;
  showType: "movie" | "tv" | "person";
  locale: "en" | "ar";
}) => {
  const tags = [
    `details-${showId}-${showType}`,
    ...(locale === "ar" && showType !== "person"
      ? [`${showType}-translations-${showId}`]
      : []),
  ];
  const cachedFn = nextCache(
    getInitialDetailsDataWithReactCache,
    [`details-app-${locale}-${showType}-${showId}`],
    {
      tags,
      revalidate: 3600,
    },
  );

  return cachedFn({ showId, showType, locale });
};

// getInitialDetailsDataCached with Map
export const getInitialDetailsDataCachedWithMap = ({
  locale,
  showId,
  showType,
}: {
  locale: "en" | "ar";
  showId: number;
  showType: "movie" | "tv" | "person";
}) =>
  getOrSet(`${locale}-${showType}-${showId}`, () =>
    getInitialDetailsDataWithNextCache({ locale, showId, showType }),
  );

//getSearchResults
export const getSearchResults = reactCache(
  async ({
    query,
    locale,
    page,
  }: {
    query: string;
    locale: "en" | "ar";
    page: number;
  }) => {
    const [initialMovies, initialTvShows, initialPeople] = await Promise.all([
      fetch(
        `${BASE_URL}search/movie?api_key=${API_KEY}&query=${query}&page=${page}&language=${locale}`,
        { next: { revalidate: 3600 } },
      ).then((res) => res.json()),
      fetch(
        `${BASE_URL}search/tv?api_key=${API_KEY}&query=${query}&page=${page}&language=${locale}`,
        { next: { revalidate: 3600 } },
      ).then((res) => res.json()),
      fetch(
        `${BASE_URL}search/person?api_key=${API_KEY}&query=${query}&page=${page}&language=${locale}`,
        { next: { revalidate: 3600 } },
      ).then((res) => res.json()),
    ]);

    return { initialMovies, initialTvShows, initialPeople };
  },
);

//cache getSearchResults
export const getSearchResultsCached = ({
  locale,
  query,
  page,
}: {
  locale: "en" | "ar";
  query: string;
  page: number;
}) =>
  getOrSet(`${locale}-${query}-${page}`, () =>
    getSearchResults({ locale, query, page }),
  );

// get movie collection
export const getMovieCollectionWithReactCache = reactCache(
  async ({
    collectionId,
    locale,
  }: {
    collectionId: string;
    locale: "en" | "ar";
  }) => {
    // collection details
    const fetchCollectionDetails = async () => {
      const res = await fetch(
        `${BASE_URL}collection/${collectionId}?api_key=${API_KEY}`,
        { next: { revalidate: 3600 } },
      );

      if (!res.ok) return null;
      const data = await res.json();
      return data as MovieCollectionResponse;
    };

    // collection translations
    const fetchCollectionTranslations = async () => {
      console.log("asdasdasdasdasdasdsa");
      const res = await fetch(
        `${BASE_URL}collection/${collectionId}/translations?api_key=${API_KEY}`,
        { next: { revalidate: 3600 } },
      );

      if (!res.ok) return null;
      const data = await res.json();
      return data as MovieCollectionTranslationsResponse;
    };

    const collectionDetails = await fetchCollectionDetails();
    let collectionTranslations = null;
    if (locale === "ar")
      collectionTranslations = await fetchCollectionTranslations();

    return { collectionDetails, collectionTranslations };
  },
);

// get movie collection with next cache
export const getMovieCollectionWithNextCache = ({
  collectionId,
  locale,
}: {
  collectionId: string;
  locale: "en" | "ar";
}) => {
  const cachedFn = nextCache(
    getMovieCollectionWithReactCache,
    [`collection-app-${collectionId}`],
    {
      revalidate: 3600,
    },
  );

  return cachedFn({ collectionId, locale });
};
