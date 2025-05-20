"use client";
import { useGetUpcomingMoviesQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import CardsSlider from "../../CardsSlider/CardsSlider";
import { useTranslations } from "next-intl";
import { Movie } from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { memo } from "react";

const LazyUpcomingMovies = () => {
  const t = useTranslations("HomePage");
  //get Upcoming movies
  const { data: upcomingMovies, isLoading: upcomingLoading } =
    useGetUpcomingMoviesQuery({ page: 1 });
  return (
    <CardsSlider
      showType="movie"
      sliderType="movies"
      title={t("UpcomingMoviesSliderTitle")}
      pageLink="/movies/Upcoming?page=1"
      theShows={(upcomingMovies?.results as Movie[]) || []}
      isLoading={upcomingLoading}
    />
  );
};

export default memo(LazyUpcomingMovies);
