import {
  getTrendingWithNextCache,
  getPopularWithNextCache,
} from "@/lib/tmdbRequests";
import type { MetadataRoute } from "next";
import { getShowTitle, nameToSlug } from "../../helpers/helpers";
import {
  MoviesTrendsResponse,
  TVShowsTrendsResponse,
} from "./interfaces/apiInterfaces/trendsInterfaces";
import { PopularPersonResponse } from "./interfaces/apiInterfaces/popularMoviesTvInterfaces";
import { locales } from "@/i18n/routing";
import { siteBaseUrl } from "../../helpers/serverHelpers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = [
    "",
    "Movies",
    "shows/explore/movie",
    "shows/all/movie",
    "shows/trending/movie",
    "shows/genres/movie",
    "movies/NowPlaying",
    "shows/popular/movie",
    "shows/topRated/movie",
    "movies/Upcoming",
    "TvShows",
    "shows/explore/tv",
    "shows/all/tv",
    "shows/trending/tv",
    "shows/genres/tv",
    "tvShows/AiringToday",
    "tvShows/OnTheAir",
    "shows/popular/tv",
    "shows/topRated/tv",
    "People",
    "people/Popular",
    "people/Trending",
  ];

  const urls: MetadataRoute.Sitemap = [];

  locales.forEach((locale) => {
    staticPaths.forEach((path) => {
      urls.push({
        url: `${siteBaseUrl}/${locale}/${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.8,
      });
    });
  });

  const [trendingMovies, trendingTvShows, popularPeople] = await Promise.all([
    getTrendingWithNextCache({ showType: "movie", locale: "en" }),
    getTrendingWithNextCache({ showType: "tv", locale: "en" }),
    getPopularWithNextCache({ showType: "person", locale: "en" }),
  ]);

  (trendingMovies?.trending as MoviesTrendsResponse)?.results.forEach(
    (movie) => {
      locales.forEach((locale) => {
        const title =
          getShowTitle({ isArabic: locale === "ar", show: movie }) ??
          movie.title;
        const slug = nameToSlug(title);

        urls.push({
          url: `${siteBaseUrl}/${locale}/details/movie/${movie.id}/${slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });

        urls.push({
          url: `${siteBaseUrl}/${locale}/watch/movie/${movie.id}/${slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
    },
  );

  (trendingTvShows?.trending as TVShowsTrendsResponse)?.results.forEach(
    (tv) => {
      locales.forEach((locale) => {
        const title =
          getShowTitle({ isArabic: locale === "ar", show: tv }) ?? tv.name;
        const slug = nameToSlug(title);

        urls.push({
          url: `${siteBaseUrl}/${locale}/details/tv/${tv.id}/${slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });

        urls.push({
          url: `${siteBaseUrl}/${locale}/watch/tv/${tv.id}/${slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.7,
        });
      });
    },
  );

  (popularPeople?.popular as PopularPersonResponse)?.results.forEach(
    (person) => {
      locales.forEach((locale) => {
        const slug = nameToSlug(person.name);
        urls.push({
          url: `${siteBaseUrl}/${locale}/details/person/${person.id}/${slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      });
    },
  );

  return urls;
}
