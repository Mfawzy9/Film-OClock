"use client";
import { useGetMoviesTvShowsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { memo, useMemo } from "react";
import { isValidMovie, isValidTVShow } from "../Explore";
import HoriCardsSlider from "../../HoriCardsSlider/HoriCardsSlider";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";

const LazyFamilyShows = ({
  showType,
  t,
}: {
  showType: "movie" | "tv";
  t: any;
}) => {
  const { data: familyShows, isLoading: familyLoading } =
    useGetMoviesTvShowsQuery({ showType, genreNum: "10751" });

  const filteredFamily = useMemo(
    () =>
      familyShows?.results?.filter(
        showType === "movie" ? isValidMovie : isValidTVShow,
      ) ?? [],
    [familyShows, showType],
  );
  return (
    <>
      <HoriCardsSlider
        data={filteredFamily as Movie[] | TVShow[]}
        isLoading={familyLoading}
        pageLink={
          showType === "movie"
            ? "/shows/all/movie?page=1&genre=10751&genreName=Family"
            : "/shows/all/tv?page=1&genre=10751&genreName=Family"
        }
        title={
          showType === "movie"
            ? t("Movies/Explore.FamilyMovies")
            : t("TvShows/Explore.FamilyTvShows")
        }
        sliderType={showType}
      />
    </>
  );
};

export default memo(LazyFamilyShows);
