"use client";
import {
  useGetGenresQuery,
  useGetUpcomingMoviesQuery,
} from "@/lib/Redux/apiSlices/tmdbSlice";
import GenresSection from "../../GenresSection/GenresSection";
import { useLocale } from "next-intl";

const LazyGenres = () => {
  const locale = useLocale();

  //get movies genres
  const { data: genres, isLoading: genresLoading } = useGetGenresQuery({
    showType: "movie",
    lang: locale,
  });

  const { data: upcomingMovies, isLoading: upcomingLoading } =
    useGetUpcomingMoviesQuery({
      page: 1,
    });
  return (
    <GenresSection
      genresList={genres?.genres || []}
      moviesOrTvShows={upcomingMovies?.results || []}
      pageLink="/shows/genres/movie?page=1"
      showType="movie"
      isLoading={genresLoading || upcomingLoading}
    />
  );
};

export default LazyGenres;
