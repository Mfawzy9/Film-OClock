"use client";
import { useMemo } from "react";
import { useGetTrendsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import PageSection from "@/app/_Components/PageSection/PageSection";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import LazyRender from "../LazyRender/LazyRender";
import dynamic from "next/dynamic";
import {
  MoviesTrendsResponse,
  TVShowsTrendsResponse,
} from "@/app/interfaces/apiInterfaces/trendsInterfaces";

const LazyGenresShows = dynamic(() => import("./LazySections/LazyGenresShows"));
const LazyRandomTrendingShow = dynamic(
  () => import("./LazySections/LazyRandomTrendingShow"),
);
const LazyLatestTrailersShows = dynamic(
  () => import("./LazySections/LazyLatestTrailersShows"),
);
const LazyActionShows = dynamic(() => import("./LazySections/LazyActionShows"));
const LazyRandomTopRatedShow = dynamic(
  () => import("./LazySections/LazyRandomTopRatedShow"),
);
const LazyArabicShows = dynamic(() => import("./LazySections/LazyArabicShows"));
const LazyFamilyShows = dynamic(() => import("./LazySections/LazyFamilyShows"));
const CardsSlider = dynamic(() => import("../CardsSlider/CardsSlider"));

//skeletons
const CardsSkeletonSlider = dynamic(
  () => import("../CardsSlider/CardsSkeletonSlider"),
);
const HoriSkeletonSlider = dynamic(
  () => import("../HoriCardsSlider/HoriSkeletonSlider"),
);
const ShortDetailsSkeleton = dynamic(
  () => import("../ShortDetails/ShortDetailsSkeleton"),
);
const VideosSkelsetonSlider = dynamic(
  () => import("../VideosSlider/VideosSkelsetonSlider"),
);
const GenresSkeletonSlider = dynamic(
  () => import("../GenresSlider/GenresSkeletonSlider"),
);

// 🔹 Type guards
const isMovie = (item: Movie | TVShow): item is Movie =>
  "original_title" in item && "release_date" in item && "title" in item;

const isTVShow = (item: Movie | TVShow): item is TVShow =>
  "original_name" in item && "first_air_date" in item && "name" in item;

export const isValidMovie = (item: Movie | TVShow): item is Movie =>
  isMovie(item) &&
  !!item.original_title?.trim() &&
  !!item.overview?.trim() &&
  !!item.poster_path?.trim();

export const isValidTVShow = (item: Movie | TVShow): item is TVShow =>
  isTVShow(item) &&
  !!item.original_name?.trim() &&
  !!item.overview?.trim() &&
  !!item.poster_path?.trim();

const Explore = () => {
  const locale = useLocale();
  const { showType } = useParams<{ showType: "movie" | "tv" }>();

  const t = useTranslations("Explore");

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
      )?.results?.filter((show) =>
        showType === "movie" ? isValidMovie(show) : isValidTVShow(show),
      ) ?? [],
    [trendingShows, showType],
  );

  return (
    <>
      {/* trending shows */}
      {trendingLoading ? (
        <PageSection>
          <CardsSkeletonSlider />
        </PageSection>
      ) : (
        <PageSection>
          <CardsSlider
            showType={showType}
            theShows={filterTrending as TVShow[] | Movie[]}
            sliderType="tvShows"
            title={
              showType === "movie"
                ? t("Movies/Explore.PopularMovies")
                : t("TvShows/Explore.PopularTvShows")
            }
            pageLink={
              showType === "movie"
                ? "/shows/popular/movie?page=1"
                : "/shows/popular/tv?page=1"
            }
            isLoading={trendingLoading}
            autoPlay={false}
          />
        </PageSection>
      )}

      {/* random trending show */}
      <LazyRender
        Component={LazyRandomTrendingShow}
        loading={<ShortDetailsSkeleton className="!my-0 !py-0" />}
        props={{
          showType,
        }}
        persistKey="randomTrendingShow-explore"
      />

      {/* latest trailers */}
      <LazyRender
        Component={LazyLatestTrailersShows}
        props={{ showType, t }}
        loading={<VideosSkelsetonSlider />}
        persistKey="latestTrailers-explore"
      />

      {/* action shows */}
      <LazyRender
        Component={LazyActionShows}
        props={{ showType, t }}
        loading={<HoriSkeletonSlider />}
        persistKey="actionShows-explore"
      />

      {/* random top rated show */}
      <LazyRender
        Component={LazyRandomTopRatedShow}
        props={{ showType }}
        loading={<ShortDetailsSkeleton className="!my-0 !pt-10 !pb-0" />}
        persistKey="randomTopRatedShow-explore"
      />

      {/* arabic shows */}
      <PageSection className="!pb-0">
        <LazyRender
          Component={LazyArabicShows}
          props={{ showType, t }}
          loading={<CardsSkeletonSlider />}
          persistKey="arabicShows-explore"
        />
      </PageSection>

      {/* family shows */}
      <LazyRender
        Component={LazyFamilyShows}
        props={{ showType, t }}
        loading={<HoriSkeletonSlider />}
      />

      {/* genres */}
      <LazyRender
        Component={LazyGenresShows}
        loading={<GenresSkeletonSlider />}
        persistKey="genres-explore"
        props={{ showType, locale }}
      />
    </>
  );
};

export default Explore;
