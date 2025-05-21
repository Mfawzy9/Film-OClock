"use client";

import { useGetTopRatedQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { memo, useMemo } from "react";
import { isValidMovie, isValidTVShow } from "../Explore";
import { useRandomShow } from "@/app/hooks/useRandomShow";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import ShortDetails from "../../ShortDetails/ShortDetails";
import PageSection from "../../PageSection/PageSection";
import ShortDetailsSkeleton from "../../ShortDetails/ShortDetailsSkeleton";

const LazyRandomTopRatedShow = ({ showType }: { showType: "movie" | "tv" }) => {
  const { data: topRatedShows, isLoading: topRatedLoading } =
    useGetTopRatedQuery({ showType, page: 1 });

  const filteredtopRated = useMemo(
    () =>
      topRatedShows?.results?.filter(
        showType === "movie" ? isValidMovie : isValidTVShow,
      ) ?? [],
    [topRatedShows, showType],
  );

  const randomTopRatedShow = useRandomShow(
    filteredtopRated as Movie[] | TVShow[],
  ) as Movie | TVShow;

  return (
    <>
      {topRatedLoading ? (
        <ShortDetailsSkeleton className="!my-0 !pt-10 !pb-0" />
      ) : (
        randomTopRatedShow && (
          <PageSection className="!my-0 !pt-10 !pb-0">
            <ShortDetails
              backdropPath={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}${randomTopRatedShow.backdrop_path}`}
              description={randomTopRatedShow.overview}
              rating={randomTopRatedShow.vote_average}
              releaseDate={
                showType === "movie"
                  ? (randomTopRatedShow as Movie).release_date
                  : (randomTopRatedShow as TVShow).first_air_date
              }
              title={
                showType === "movie"
                  ? ((randomTopRatedShow as Movie).title ??
                    (randomTopRatedShow as Movie).original_title)
                  : ((randomTopRatedShow as TVShow).name ??
                    (randomTopRatedShow as TVShow).original_name)
              }
              className="!my-0"
              genresIds={randomTopRatedShow.genre_ids}
              showType={showType}
              showId={randomTopRatedShow.id}
              theShow={randomTopRatedShow}
            />
          </PageSection>
        )
      )}
    </>
  );
};

export default memo(LazyRandomTopRatedShow);
