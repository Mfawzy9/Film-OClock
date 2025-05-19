"use client";
import { useGetTopRatedQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { useTranslations } from "next-intl";
import HoriCardsSlider from "../../HoriCardsSlider/HoriCardsSlider";
import { memo } from "react";

const LazyTopRatedMovies = () => {
  const t = useTranslations("HomePage");
  //get top rated movies
  const { data: topRatedMovies, isLoading: topRatedLoading } =
    useGetTopRatedQuery({
      showType: "movie",
      page: 1,
    });
  return (
    <HoriCardsSlider
      pageLink="/shows/topRated/movie?page=1"
      title={t("TopMoviesSliderTitle")}
      sliderType="movie"
      data={topRatedMovies?.results || []}
      isLoading={topRatedLoading}
    />
  );
};

export default memo(LazyTopRatedMovies);
