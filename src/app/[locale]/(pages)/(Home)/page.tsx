"use client";
import HomeSlider from "@/app/_Components/MainHomeSlider/HomeSlider";
import { useGetTrendsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { MovieTrendsI } from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import PageSection from "@/app/_Components/PageSection/PageSection";
import { useEffect, useMemo, useRef, useState } from "react";
import ScrollToSection from "@/app/_Components/ScrollToSection/ScrollToSection";
import WatchHistory from "@/app/_Components/Home/WatchHistory/WatchHistory";
import useIsArabic from "@/app/hooks/useIsArabic";

import LazyRender from "@/app/_Components/LazyRender/LazyRender";
import CardsSkeletonSlider from "@/app/_Components/CardsSlider/CardsSkeletonSlider";
import MainLoader from "@/app/_Components/MainLoader/MainLoader";
import HoriSkeletonSlider from "@/app/_Components/HoriCardsSlider/HoriSkeletonSlider";
import LazyWatchlist from "@/app/_Components/Home/LazySections/LazyWatchlist";
import VideosSkelsetonSlider from "@/app/_Components/VideosSlider/VideosSkelsetonSlider";
import dynamic from "next/dynamic";
import GenresSkeletonSlider from "@/app/_Components/GenresSlider/GenresSkeletonSlider";
import { WatchHistoryItem } from "@/app/interfaces/localInterfaces/watchHistoryInterfaces";
import ShortDetailsSkeleton from "@/app/_Components/ShortDetails/ShortDetailsSkeleton";

const LazyPopularPpl = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyPopularPpl"),
  { loading: () => <CardsSkeletonSlider />, ssr: false },
);
const LazyTopRatedMovies = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyTopRatedMovies"),
  { loading: () => <HoriSkeletonSlider />, ssr: false },
);
const LazyLastWatched = dynamic(
  () => import("@/app/_Components/Home/WatchHistory/LastWatched"),
  {
    loading: () => <ShortDetailsSkeleton />,
    ssr: false,
  },
);
const LazyTrendingTvShows = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyTrendingTvShows"),
  { loading: () => <CardsSkeletonSlider />, ssr: false },
);
const LazyLatestTrailers = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyLatestTrailers"),
  { loading: () => <VideosSkelsetonSlider />, ssr: false },
);
const LazyUpcomingMovies = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyUpcomingMovies"),
  { loading: () => <CardsSkeletonSlider />, ssr: false },
);
const LazyMostVotedTvShows = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyMostVotedTvShows"),
  { loading: () => <HoriSkeletonSlider />, ssr: false },
);
const LazyGenres = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyGenres"),
  { loading: () => <GenresSkeletonSlider />, ssr: false },
);

const Home = () => {
  const { isArabic } = useIsArabic();
  const firstSectionRef = useRef<HTMLDivElement>(null);

  const { data: trendingMovies, isLoading: trendingLoading } =
    useGetTrendsQuery({
      showType: "movie",
      page: 1,
      lang: isArabic ? "ar" : "en",
    });

  const filteredTrendingMovies = useMemo(() => {
    if (!trendingMovies) return;

    return isArabic
      ? trendingMovies.results.filter((movie) =>
          (movie as MovieTrendsI).overview?.trim(),
        )
      : trendingMovies.results;
  }, [isArabic, trendingMovies]);

  const [hasHistory, setHasHistory] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const history = localStorage.getItem("WatchedHistory");
    if (!history) {
      setHasHistory(false);
      return;
    }
    const parsedHistory = JSON.parse(history || "[]");
    const historyArray = Object.values(parsedHistory) as WatchHistoryItem[];
    if (historyArray.length > 0) {
      setHasHistory(true);
    } else {
      setHasHistory(false);
    }
  }, []);

  if (trendingLoading) return <MainLoader />;

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
      />
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* last watched show */}
      <LazyRender
        Component={LazyLastWatched}
        loading={<ShortDetailsSkeleton />}
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

export default Home;
