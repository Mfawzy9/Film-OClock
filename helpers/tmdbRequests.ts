"use server";
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
export async function getOrSet<T>(
  key: string,
  fn: () => Promise<T>,
): Promise<T> {
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

export const getInitialDetailsData = async ({
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

  const fetchData = async () => {
    const lang = showType === "person" ? locale : "en";

    const detailsRes = await fetch(
      `${BASE_URL}${showType}/${showId}?api_key=${API_KEY}&append_to_response=videos,images,external_ids,credits,recommendations,reviews,similar,combined_credits,movie_credits,tv_credits&language=${lang}`,
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      },
    );

    if (!detailsRes.ok) return { initialData: null, initialTranslations: null };

    const initialData = (await detailsRes.json()) as
      | MovieDetailsResponse
      | PersonDetailsResponse
      | TvDetailsResponse;

    let initialTranslations = null;

    if (locale === "ar" && showType !== "person") {
      const translationsRes = await fetch(
        `${BASE_URL}${showType}/${showId}/translations?api_key=${API_KEY}`,
        {
          headers: {
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        },
      );

      if (translationsRes.ok) {
        initialTranslations = (await translationsRes.json()) as
          | TvTranslationsResponse
          | MovieTranslationsResponse;
      }
    }

    return { initialData, initialTranslations };
  };

  const withReactCache = reactCache(fetchData);

  const withNextCache = nextCache(
    withReactCache,
    [`details-app-${locale}-${showType}-${showId}`],
    { tags, revalidate: 3600 },
  );

  return withNextCache();
};

// getInitialDetailsDataCached with Map
export const getInitialDetailsDataCachedWithMap = async ({
  locale,
  showId,
  showType,
}: {
  locale: "en" | "ar";
  showId: number;
  showType: "movie" | "tv" | "person";
}) =>
  getOrSet(`${locale}-${showType}-${showId}`, () =>
    getInitialDetailsData({ locale, showId, showType }),
  );

//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------

//getSearchResults
export const getSearchResults = async ({
  query,
  locale,
  page,
}: {
  query: string;
  locale: "en" | "ar";
  page: number;
}) => {
  // Use both React and Next cache
  const cachedFn = nextCache(
    reactCache(async () => {
      const [initialMovies, initialTvShows, initialPeople] = await Promise.all([
        fetch(
          `${BASE_URL}search/movie?api_key=${API_KEY}&query=${query}&page=${page}&language=${locale}`,
        ).then((res) => res.json()),
        fetch(
          `${BASE_URL}search/tv?api_key=${API_KEY}&query=${query}&page=${page}&language=${locale}`,
        ).then((res) => res.json()),
        fetch(
          `${BASE_URL}search/person?api_key=${API_KEY}&query=${query}&page=${page}&language=${locale}`,
        ).then((res) => res.json()),
      ]);

      return { initialMovies, initialTvShows, initialPeople };
    }),
    [`search-results-${locale}-${query}-${page}`], // Cache key based on locale, query, and page
    {
      tags: [`search-results-${locale}-${query}-${page}`],
      revalidate: 3600, // Revalidate every hour
    },
  );

  return cachedFn();
};

//cache getSearchResults
export const getSearchResultsCached = async ({
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

//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------

// get movie collection
export const getMovieCollectionWithNextCache = async ({
  collectionId,
  locale,
}: {
  collectionId: string;
  locale: "en" | "ar";
}) => {
  const fetchData = async () => {
    const detailsRes = await fetch(
      `${BASE_URL}collection/${collectionId}?api_key=${API_KEY}`,
      {
        next: { revalidate: 3600 },
      },
    );

    if (!detailsRes.ok)
      return { collectionDetails: null, collectionTranslations: null };

    const collectionDetails =
      (await detailsRes.json()) as MovieCollectionResponse;

    let collectionTranslations = null;

    if (locale === "ar") {
      const translationsRes = await fetch(
        `${BASE_URL}collection/${collectionId}/translations?api_key=${API_KEY}`,
        {
          next: { revalidate: 3600 },
        },
      );

      if (translationsRes.ok) {
        collectionTranslations =
          (await translationsRes.json()) as MovieCollectionTranslationsResponse;
      }
    }

    return { collectionDetails, collectionTranslations };
  };

  const withReactCache = reactCache(fetchData);

  const withNextCache = nextCache(
    withReactCache,
    [`collection-app-${collectionId}-${locale}`],
    {
      revalidate: 3600,
    },
  );

  return withNextCache();
};
