"use client";

import {
  useGetTrendsQuery,
  useLazyGetVideosQuery,
} from "@/lib/Redux/apiSlices/tmdbSlice";
import VideosSlider from "../../VideosSlider/VideosSlider";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import {
  MoviesTrendsResponse,
  TVShowsTrendsResponse,
} from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import { memo, useMemo } from "react";
import { isValidMovie, isValidTVShow } from "../Explore";

const LazyLatestTrailersShows = ({
  showType,
  t,
}: {
  showType: "movie" | "tv";
  t: any;
}) => {
  const { data: trendingShows, isLoading: trendingLoading } = useGetTrendsQuery(
    {
      showType,
      dayOrWeek: "day",
      page: 1,
      lang: "en",
    },
  );
  const [getVideos, { isLoading: videosLoading, isFetching: videosFetching }] =
    useLazyGetVideosQuery();

  const filterTrending = useMemo(
    () =>
      (
        trendingShows as MoviesTrendsResponse | TVShowsTrendsResponse
      )?.results?.filter(showType === "movie" ? isValidMovie : isValidTVShow) ??
      [],
    [trendingShows, showType],
  );
  return (
    <>
      <VideosSlider
        getVideos={getVideos}
        pageLink={
          showType === "movie"
            ? "/movies/Upcoming?page=1"
            : "/shows/trending/tv?page=1"
        }
        theShows={filterTrending as Movie[] | TVShow[]}
        showType={showType}
        title={
          showType === "movie"
            ? t("Movies/Explore.LatestTrailers")
            : t("TvShows/Explore.LatestTrailers")
        }
        isLoading={trendingLoading || videosLoading || videosFetching}
      />
    </>
  );
};

export default memo(LazyLatestTrailersShows);
