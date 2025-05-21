"use client";

import { useGetMoviesTvShowsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { memo, useMemo } from "react";
import { isValidMovie, isValidTVShow } from "../Explore";
import HoriCardsSlider from "../../HoriCardsSlider/HoriCardsSlider";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";

const LazyActionShows = ({
  showType,
  t,
}: {
  showType: "movie" | "tv";
  t: any;
}) => {
  const { data: actionShows, isLoading: actionLoading } =
    useGetMoviesTvShowsQuery({
      showType,
      genreNum: showType === "movie" ? "28" : "10759",
    });

  const filteredAction = useMemo(
    () =>
      actionShows?.results?.filter(
        showType === "movie" ? isValidMovie : isValidTVShow,
      ) ?? [],
    [actionShows, showType],
  );
  return (
    <>
      <HoriCardsSlider
        data={filteredAction as Movie[] | TVShow[]}
        isLoading={actionLoading}
        pageLink={
          showType === "movie"
            ? "/shows/all/movie?page=1&genre=28&genreName=Action"
            : "/shows/all/tv?page=1&genre=10759&genreName=Action"
        }
        sliderType={showType}
        title={
          showType === "movie"
            ? t("Movies/Explore.ActionMovies")
            : t("TvShows/Explore.ActionTvShows")
        }
      />
    </>
  );
};

export default memo(LazyActionShows);
