import type { MetadataRoute } from "next";
import { Languages } from "next/dist/lib/metadata/types/alternative-urls-types";

type Sitemap = Array<{
  url: string;
  lastModified?: string | Date;
  changeFrequency?:
    | "always"
    | "hourly"
    | "daily"
    | "weekly"
    | "monthly"
    | "yearly"
    | "never";
  priority?: number;
  alternates?: {
    languages?: Languages<string>;
  };
}>;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://film-oclock.vercel.app";
  const locales = ["en", "ar"];

  const staticPaths = [
    "", // Home
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

  const urls: Sitemap = [];

  locales.forEach((locale) => {
    staticPaths.forEach((path) => {
      urls.push({
        url: `${baseUrl}/${locale}/${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.7,
      });
    });
  });

  return urls;
}
