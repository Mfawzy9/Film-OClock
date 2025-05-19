import {
  MovieDetailsResponse,
  PersonDetailsResponse,
  TvDetailsResponse,
} from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import { GenresResponse } from "@/app/interfaces/apiInterfaces/genresInterfaces";
import { MovieCollectionResponse } from "@/app/interfaces/apiInterfaces/movieCollectionInterfaces";
import { MovieCollectionTranslationsResponse } from "@/app/interfaces/apiInterfaces/movieCollectionTranslationsInterfaces";
import {
  PopularMoviesResponse,
  PopularPersonResponse,
  PopularTvShowResponse,
} from "@/app/interfaces/apiInterfaces/popularMoviesTvInterfaces";
import { SearchMovieResponse } from "@/app/interfaces/apiInterfaces/searchMovieInterfaces";
import { SearchPersonResponse } from "@/app/interfaces/apiInterfaces/searchPersonInterfaces";
import { SearchTvShowResponse } from "@/app/interfaces/apiInterfaces/SearchTvshowInterfaces";
import {
  TvTranslationsResponse,
  MovieTranslationsResponse,
} from "@/app/interfaces/apiInterfaces/translationsInterfaces";
import {
  MoviesTrendsResponse,
  MovieTrendsI,
  PplTrendsResponse,
  TVShowsTrendsResponse,
} from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL!;
const API_KEY = process.env.TMDB_API_KEY!;
const ACCESS_TOKEN = process.env.TMDB_ACCESS_TOKEN!;
const headers = {
  Authorization: `Bearer ${ACCESS_TOKEN}`,
};

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

//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------

//getSearchResults
export const getSearchResults = ({
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
          {
            headers,
          },
        )
          .then((res) => res.json())
          .then((data) => data as SearchMovieResponse),
        fetch(
          `${BASE_URL}search/tv?api_key=${API_KEY}&query=${query}&page=${page}&language=${locale}`,
          {
            headers,
          },
        )
          .then((res) => res.json())
          .then((data) => data as SearchTvShowResponse),
        fetch(
          `${BASE_URL}search/person?api_key=${API_KEY}&query=${query}&page=${page}&language=${locale}`,
          {
            headers,
          },
        )
          .then((res) => res.json())
          .then((data) => data as SearchPersonResponse),
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

//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------

// get movie collection
export const getMovieCollectionWithNextCache = ({
  collectionId,
  locale,
}: {
  collectionId: string;
  locale: "en" | "ar";
}) => {
  const fetchData = async () => {
    const detailsRes = await fetch(
      `${BASE_URL}collection/${collectionId}?api_key=${API_KEY}`,
      { headers },
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
          headers,
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
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------

// get trending
export const getTrendingWithNextCache = ({
  locale,
  showType,
  homePge,
  dayOrWeek = "day",
}: {
  locale: "en" | "ar";
  showType: "movie" | "tv" | "person";
  homePge?: boolean;
  dayOrWeek?: "day" | "week";
}) => {
  const fetchTrending = async () => {
    const lang = homePge ? locale : "en-US";
    const trendingRes = await fetch(
      `${BASE_URL}trending/${showType}/${dayOrWeek}?api_key=${API_KEY}&language=${lang}`,
      { headers },
    );

    if (!trendingRes.ok) return { trending: null };

    const trending = (await trendingRes.json()) as
      | MoviesTrendsResponse
      | PplTrendsResponse
      | TVShowsTrendsResponse;

    if (homePge && showType === "movie") {
      const filteredMovies =
        trending.results.filter((movie) =>
          (movie as MovieTrendsI).overview?.trim(),
        ) ?? trending.results;
      return { trending: { ...trending, results: filteredMovies } };
    }

    return { trending };
  };

  const withReactCache = reactCache(fetchTrending);

  const withNextCache = nextCache(
    withReactCache,
    [`trending-app-${showType}-${locale}`],
    {
      tags: [`trending-app-${showType}-${locale}`],
      revalidate: 3600,
    },
  );

  return withNextCache();
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------

// get genres
export const getGenresWithNextCache = ({
  locale,
  showType,
}: {
  locale: "en" | "ar";
  showType: "movie" | "tv";
}) => {
  const fetchGenres = async () => {
    const genresRes = await fetch(
      `${BASE_URL}genre/${showType}/list?api_key=${API_KEY}&language=${locale}`,
      { headers },
    );

    if (!genresRes.ok) return { genres: null };

    const genres = (await genresRes.json()) as GenresResponse;

    return { genres };
  };

  const withReactCache = reactCache(fetchGenres);

  const withNextCache = nextCache(
    withReactCache,
    [`genres-app-${showType}-${locale}`],
    {
      tags: [`genres-app-${showType}-${locale}`],
      revalidate: 3600,
    },
  );

  return withNextCache();
};
//------------------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------

// get popular
export const getPopularWithNextCache = ({
  locale = "en",
  showType,
}: {
  locale: "en" | "ar";
  showType: "movie" | "tv" | "person";
}) => {
  const fetchPopular = async () => {
    const popularRes = await fetch(
      `${BASE_URL}${showType}/popular?api_key=${API_KEY}&language=${locale}`,
      { headers },
    );

    if (!popularRes.ok) return { popular: null };

    const popular = (await popularRes.json()) as
      | PopularMoviesResponse
      | PopularPersonResponse
      | PopularTvShowResponse;

    return { popular };
  };

  const withReactCache = reactCache(fetchPopular);

  const withNextCache = nextCache(
    withReactCache,
    [`popular-app-${showType}-${locale}`],
    {
      tags: [`popular-app-${showType}-${locale}`],
      revalidate: 3600,
    },
  );

  return withNextCache();
};
