import { PopularPersonResponse } from "@/app/interfaces/apiInterfaces/popularMoviesTvInterfaces";
import {
  MoviesTrendsResponse,
  TVShowsTrendsResponse,
} from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import { locales } from "@/i18n/routing";
import {
  getTrendingWithNextCache,
  getPopularWithNextCache,
} from "@/lib/tmdbRequests";
import { headers } from "next/headers";
import { nameToSlug, getShowTitle } from "./helpers";

export const getBaseUrl = async () => {
  const headersStore = await headers();
  const host = headersStore.get("host");
  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
  return `${protocol}://${host}`;
};

export const siteBaseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://film-oclock.vercel.app";

export const itemTypeMap = {
  movie: "https://schema.org/Movie",
  tv: "https://schema.org/TVSeries",
  person: "https://schema.org/Person",
};

export async function getStaticShowParams({
  includePeople,
}: {
  includePeople?: boolean;
}) {
  const { trending: trendingMovies } = await getTrendingWithNextCache({
    locale: "en",
    showType: "movie",
  });

  const { trending: trendingTvShows } = await getTrendingWithNextCache({
    locale: "en",
    showType: "tv",
  });

  const movieParams = (trendingMovies as MoviesTrendsResponse)?.results.flatMap(
    (movie) =>
      locales.map((locale) => ({
        locale,
        showType: "movie" as const,
        showId: movie.id.toString(),
        slug: nameToSlug(
          getShowTitle({ isArabic: locale === "ar", show: movie }) ??
            movie.title,
        ),
      })),
  );

  const tvParams = (trendingTvShows as TVShowsTrendsResponse)?.results.flatMap(
    (tvShow) =>
      locales.map((locale) => ({
        locale,
        showType: "tv" as const,
        showId: tvShow.id.toString(),
        slug: nameToSlug(
          getShowTitle({ isArabic: locale === "ar", show: tvShow }) ??
            tvShow.name,
        ),
      })),
  );

  if (!includePeople) {
    return [...movieParams, ...tvParams];
  }

  const { popular: popularPeople } = await getPopularWithNextCache({
    showType: "person",
    locale: "en",
  });

  const personParams = (
    popularPeople as PopularPersonResponse
  )?.results.flatMap((person) =>
    locales.map((locale) => ({
      locale,
      showType: "person" as const,
      showId: person.id.toString(),
      slug: nameToSlug(person.name),
    })),
  );

  return [...movieParams, ...tvParams, ...personParams];
}
