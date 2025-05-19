import React, { memo } from "react";
import CardsSlider from "../../CardsSlider/CardsSlider";
import { useTranslations } from "next-intl";
import { useGetTrendsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { TVShow } from "@/app/interfaces/apiInterfaces/discoverInterfaces";

const LazyTrendingTvShows = () => {
  const t = useTranslations("HomePage");
  //get trending tvshows
  const { data: trendingTvShows, isLoading: trendingTvLoading } =
    useGetTrendsQuery({
      showType: "tv",
      page: 1,
    });
  return (
    <CardsSlider
      showType="tv"
      sliderType="tvShows"
      title={t("TrendingTvShowsSliderTitle")}
      pageLink="/shows/trending/tv?page=1"
      theShows={(trendingTvShows?.results as TVShow[]) || []}
      isLoading={trendingTvLoading}
    />
  );
};

export default memo(LazyTrendingTvShows);
