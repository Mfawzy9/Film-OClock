"use client";
import HomeSlider from "@/app/_Components/MainHomeSlider/HomeSlider";
import { useGetTrendsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { MovieTrendsI } from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import PageSection from "@/app/_Components/PageSection/PageSection";
import { useEffect, useMemo, useRef, useState } from "react";
import ScrollToSection from "@/app/_Components/ScrollToSection/ScrollToSection";
import useIsArabic from "@/app/hooks/useIsArabic";
import LazyRender from "@/app/_Components/LazyRender/LazyRender";
import LazyWatchlist from "@/app/_Components/Home/LazySections/LazyWatchlist";
import dynamic from "next/dynamic";
import { WatchHistoryItem } from "@/app/interfaces/localInterfaces/watchHistoryInterfaces";

const WatchHistory = dynamic(
  () => import("@/app/_Components/Home/WatchHistory/WatchHistory"),
);
const HomeSliderSkeleton = dynamic(
  () => import("../MainHomeSlider/HomeSliderSkeleton"),
);
const ShortDetailsSkeleton = dynamic(
  () => import("@/app/_Components/ShortDetails/ShortDetailsSkeleton"),
);
const GenresSkeletonSlider = dynamic(
  () => import("@/app/_Components/GenresSlider/GenresSkeletonSlider"),
);
const VideosSkelsetonSlider = dynamic(
  () => import("@/app/_Components/VideosSlider/VideosSkelsetonSlider"),
);
const HoriSkeletonSlider = dynamic(
  () => import("@/app/_Components/HoriCardsSlider/HoriSkeletonSlider"),
);
const CardsSkeletonSlider = dynamic(
  () => import("@/app/_Components/CardsSlider/CardsSkeletonSlider"),
);
const LazyPopularPpl = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyPopularPpl"),
);
const LazyTopRatedMovies = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyTopRatedMovies"),
);
const LazyLastWatched = dynamic(
  () => import("@/app/_Components/Home/WatchHistory/LastWatched"),
);
const LazyTrendingTvShows = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyTrendingTvShows"),
);
const LazyLatestTrailers = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyLatestTrailers"),
);
const LazyUpcomingMovies = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyUpcomingMovies"),
);
const LazyMostVotedTvShows = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyMostVotedTvShows"),
);
const LazyGenres = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyGenres"),
);

const HomeComp = () => {
  const { isArabic } = useIsArabic();
  const firstSectionRef = useRef<HTMLDivElement>(null);

  const {
    data: trendingMovies,
    isLoading: trendingLoading,
    isError: trendingError,
  } = useGetTrendsQuery({
    showType: "movie",
    page: 1,
    lang: isArabic ? "ar" : "en",
  });

  const filteredTrendingMovies = useMemo(() => {
    if (!trendingMovies?.results) return [];
    return isArabic
      ? trendingMovies.results.filter((movie) =>
          (movie as MovieTrendsI).overview?.trim(),
        )
      : trendingMovies.results;
  }, [isArabic, trendingMovies]);

  const [hasHistory, setHasHistory] = useState(false);
  useEffect(() => {
    try {
      const history = localStorage.getItem("WatchedHistory");
      const parsed = JSON.parse(history || "{}");
      const values = Object.values(parsed) as WatchHistoryItem[];
      setHasHistory(values.length > 0);
    } catch {
      setHasHistory(false);
    }
  }, []);

  if (trendingLoading || trendingError) return <HomeSliderSkeleton />;

  return (
    <>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      <ScrollToSection reference={firstSectionRef} />
      <HomeSlider data={(filteredTrendingMovies as MovieTrendsI[]) || []} />
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* watch history */}
      {hasHistory && <WatchHistory />}
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* popular people */}
      <div ref={firstSectionRef}>
        <PageSection>
          <LazyRender
            Component={LazyPopularPpl}
            loading={<CardsSkeletonSlider />}
            noLazy
          />
        </PageSection>
      </div>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* top rated movies */}
      <LazyRender
        Component={LazyTopRatedMovies}
        loading={<HoriSkeletonSlider />}
        rootMargin="0px 0px"
      />
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* last watched show */}
      <LazyRender
        Component={LazyLastWatched}
        loading={<ShortDetailsSkeleton className="!py-0 mt-14" />}
      />
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* trending today tv shows */}
      <PageSection>
        <LazyRender
          Component={LazyTrendingTvShows}
          loading={<CardsSkeletonSlider />}
        />
      </PageSection>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* Watchlist */}
      <PageSection className="!py-5">
        <LazyWatchlist />
      </PageSection>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* latest trailers */}
      <LazyRender
        Component={LazyLatestTrailers}
        loading={<VideosSkelsetonSlider />}
        rootMargin="800px 0px"
      />
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* Upcoming Movies */}
      <PageSection className="!py-5">
        <LazyRender
          Component={LazyUpcomingMovies}
          loading={<CardsSkeletonSlider />}
        />
      </PageSection>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* most rated Tv Shows */}
      <LazyRender
        Component={LazyMostVotedTvShows}
        loading={<HoriSkeletonSlider />}
      />
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* genres Section */}
      <LazyRender Component={LazyGenres} loading={<GenresSkeletonSlider />} />
    </>
  );
};

export default HomeComp;
