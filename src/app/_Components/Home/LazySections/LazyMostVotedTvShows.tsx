import { useGetMoviesTvShowsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { useTranslations } from "next-intl";
import { memo } from "react";
import HoriCardsSlider from "../../HoriCardsSlider/HoriCardsSlider";

const LazyMostVotedTvShows = () => {
  const t = useTranslations("HomePage");

  // get most voted tvshows
  const { data: discoverTvShows, isLoading: discoverLoading } =
    useGetMoviesTvShowsQuery({
      page: 1,
      showType: "tv",
      sortBy: "vote_count.desc",
    });
  return (
    <HoriCardsSlider
      pageLink="/shows/all/tv?page=1&sortBy=vote_count.desc"
      title={t("TopTvShowsSliderTitle")}
      sliderType="tv"
      data={discoverTvShows?.results || []}
      isLoading={discoverLoading}
    />
  );
};

export default memo(LazyMostVotedTvShows);
