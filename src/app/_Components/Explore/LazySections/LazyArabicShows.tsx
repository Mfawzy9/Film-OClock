"use client";

import { useGetMoviesTvShowsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { memo, useMemo } from "react";
import { isValidMovie, isValidTVShow } from "../Explore";
import CardsSlider from "../../CardsSlider/CardsSlider";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import CardsSkeletonSlider from "../../CardsSlider/CardsSkeletonSlider";

const LazyArabicShows = ({
  showType,
  t,
}: {
  showType: "movie" | "tv";
  t: any;
}) => {
  const { data: arabicShows, isLoading: arabicLoading } =
    useGetMoviesTvShowsQuery({ showType, ori_lang: "ar" });

  const filteredArabic = useMemo(
    () =>
      arabicShows?.results?.filter(
        showType === "movie" ? isValidMovie : isValidTVShow,
      ) ?? [],
    [arabicShows, showType],
  );
  return (
    <>
      {arabicLoading ? (
        <CardsSkeletonSlider />
      ) : (
        <CardsSlider
          theShows={filteredArabic as Movie[] | TVShow[]}
          showType={showType}
          isLoading={arabicLoading}
          sliderType={showType === "movie" ? "movies" : "tvShows"}
          title={
            showType === "movie"
              ? t("Movies/Explore.ArabicMovies")
              : t("TvShows/Explore.ArabicTvShows")
          }
          className="!mb-0"
          pageLink={
            showType === "movie"
              ? "/shows/all/movie?page=1&oriLang=ar"
              : "/shows/all/tv?page=1&oriLang=ar"
          }
          arrLength={filteredArabic?.length}
        />
      )}
    </>
  );
};

export default memo(LazyArabicShows);
