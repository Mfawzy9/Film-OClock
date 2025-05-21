"use client";

import {
  useGetGenresQuery,
  useGetPopularQuery,
} from "@/lib/Redux/apiSlices/tmdbSlice";
import GenresSection from "../../GenresSection/GenresSection";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import {
  PopularMoviesResponse,
  PopularTvShowResponse,
} from "@/app/interfaces/apiInterfaces/popularMoviesTvInterfaces";
import { memo, useMemo } from "react";
import { isValidMovie, isValidTVShow } from "../Explore";

const LazyGenresShows = ({
  showType,
  locale,
}: {
  showType: "movie" | "tv";
  locale: "en" | "ar";
}) => {
  const { data: popularShows, isLoading: popularLoading } = useGetPopularQuery({
    page: 1,
    showType,
  });

  const { data: genres, isLoading: genresLoading } = useGetGenresQuery({
    showType,
    lang: locale,
  });

  const filteredPopular = useMemo(
    () =>
      (
        popularShows as PopularMoviesResponse | PopularTvShowResponse
      )?.results?.filter(showType === "movie" ? isValidMovie : isValidTVShow) ??
      [],
    [popularShows, showType],
  );

  return (
    <GenresSection
      genresList={genres?.genres || []}
      isLoading={genresLoading || popularLoading}
      moviesOrTvShows={filteredPopular as Movie[] | TVShow[]}
      pageLink={`/shows/genres/${showType}?page=1`}
      showType={showType}
    />
  );
};

export default memo(LazyGenresShows);
