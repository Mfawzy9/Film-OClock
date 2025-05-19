import {
  useGetTrendsQuery,
  useLazyGetVideosQuery,
} from "@/lib/Redux/apiSlices/tmdbSlice";
import VideosSlider from "../../VideosSlider/VideosSlider";
import { Movie } from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { useTranslations } from "next-intl";
import { memo } from "react";

const LazyLatestTrailers = () => {
  const t = useTranslations("HomePage");
  const [getVideos, { isLoading: videosLoading }] = useLazyGetVideosQuery();
  const { data: trendingMovies, isLoading: trendingLoading } =
    useGetTrendsQuery({
      showType: "movie",
      dayOrWeek: "day",
      page: 1,
      lang: "en",
    });
  return (
    <VideosSlider
      getVideos={getVideos}
      theShows={(trendingMovies?.results as Movie[]) || []}
      showType="movie"
      title={t("LatestTrailersSliderTitle")}
      pageLink="/shows/trending/movie?page=1"
      isLoading={trendingLoading || videosLoading}
    />
  );
};

export default memo(LazyLatestTrailers);
