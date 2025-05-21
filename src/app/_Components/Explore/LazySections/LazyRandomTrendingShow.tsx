"use client";

import { useRandomShow } from "@/app/hooks/useRandomShow";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import PageSection from "../../PageSection/PageSection";
import ShortDetails from "../../ShortDetails/ShortDetails";
import ShortDetailsSkeleton from "../../ShortDetails/ShortDetailsSkeleton";
import {
  MoviesTrendsResponse,
  TVShowsTrendsResponse,
} from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import { useGetTrendsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { memo, useMemo } from "react";
import { isValidMovie, isValidTVShow } from "../Explore";

const LazyRandomTrendingShow = ({ showType }: { showType: "movie" | "tv" }) => {
  const { data: trendingShows, isLoading: trendingLoading } = useGetTrendsQuery(
    {
      showType,
      dayOrWeek: "day",
      page: 1,
      lang: "en",
    },
  );

  const filterTrending = useMemo(
    () =>
      (
        trendingShows as MoviesTrendsResponse | TVShowsTrendsResponse
      )?.results?.filter(showType === "movie" ? isValidMovie : isValidTVShow) ??
      [],
    [trendingShows, showType],
  );
  const randomTrendingShow = useRandomShow(
    filterTrending as Movie[] | TVShow[],
  ) as Movie | TVShow;
  return (
    <>
      {trendingLoading ? (
        <ShortDetailsSkeleton className="!my-0 !py-0" />
      ) : randomTrendingShow ? (
        <PageSection className="!my-0 !py-0">
          <ShortDetails
            backdropPath={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}${randomTrendingShow.backdrop_path}`}
            description={randomTrendingShow.overview}
            genresIds={randomTrendingShow.genre_ids}
            releaseDate={
              showType === "movie"
                ? (randomTrendingShow as Movie).release_date
                : (randomTrendingShow as TVShow).first_air_date
            }
            rating={randomTrendingShow.vote_average}
            showId={randomTrendingShow.id}
            showType={showType}
            title={
              showType === "movie"
                ? ((randomTrendingShow as Movie).title ??
                  (randomTrendingShow as Movie).original_title)
                : ((randomTrendingShow as TVShow).name ??
                  (randomTrendingShow as TVShow).original_name)
            }
            className="!my-0 !py-0"
            theShow={randomTrendingShow}
          />
        </PageSection>
      ) : null}
    </>
  );
};

export default memo(LazyRandomTrendingShow);
