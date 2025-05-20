"use client";
import PageSection from "@/app/_Components/PageSection/PageSection";
import dynamic from "next/dynamic";
import CardsSkeletonSlider from "../../CardsSlider/CardsSkeletonSlider";
import GenresSkeletonSlider from "../../GenresSlider/GenresSkeletonSlider";
import HoriSkeletonSlider from "../../HoriCardsSlider/HoriSkeletonSlider";
import ShortDetailsSkeleton from "../../ShortDetails/ShortDetailsSkeleton";
import VideosSkelsetonSlider from "../../VideosSlider/VideosSkelsetonSlider";
import LazyWatchlist from "../LazySections/LazyWatchlist";
import LazyRenderForServerParent from "../../LazyRender/LazyRenderForServerParent";
import { motion } from "framer-motion";

const LazyTopRatedMovies = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyTopRatedMovies"),
  {
    ssr: false,
    loading: () => <HoriSkeletonSlider />,
  },
);

const LazyLastWatched = dynamic(
  () => import("@/app/_Components/Home/WatchHistory/LastWatched"),
  {
    ssr: false,
    loading: () => <ShortDetailsSkeleton />,
  },
);

const LazyTrendingTvShows = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyTrendingTvShows"),
  {
    ssr: false,
    loading: () => <CardsSkeletonSlider />,
  },
);

const LazyLatestTrailers = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyLatestTrailers"),
  {
    ssr: false,
    loading: () => <VideosSkelsetonSlider />,
  },
);

const LazyUpcomingMovies = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyUpcomingMovies"),
  {
    ssr: false,
    loading: () => <CardsSkeletonSlider />,
  },
);

const LazyMostVotedTvShows = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyMostVotedTvShows"),
  {
    ssr: false,
    loading: () => <HoriSkeletonSlider />,
  },
);

const LazyGenres = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyGenres"),
  {
    ssr: false,
    loading: () => <GenresSkeletonSlider />,
  },
);

const HomeClient = () => {
  return (
    <motion.div layout>
      {/* Top Rated Movies */}
      <LazyRenderForServerParent
        persistKey="topRatedMovies"
        loading={<HoriSkeletonSlider />}
      >
        <LazyTopRatedMovies />
      </LazyRenderForServerParent>

      {/* Last Watched */}
      <LazyRenderForServerParent
        persistKey="lastWatched"
        loading={<ShortDetailsSkeleton className="!py-0 mt-14" />}
      >
        <LazyLastWatched />
      </LazyRenderForServerParent>

      {/* Trending Today TV Shows */}
      <PageSection>
        <LazyRenderForServerParent
          persistKey="trendingTv"
          loading={<CardsSkeletonSlider />}
        >
          <LazyTrendingTvShows />
        </LazyRenderForServerParent>
      </PageSection>

      {/* Watchlist */}
      <PageSection className="!py-5">
        <LazyWatchlist />
      </PageSection>

      {/* Latest Trailers */}
      <LazyRenderForServerParent
        persistKey="latestTrailers"
        loading={<VideosSkelsetonSlider />}
      >
        <LazyLatestTrailers />
      </LazyRenderForServerParent>

      {/* Upcoming Movies */}
      <PageSection className="!py-5">
        <LazyRenderForServerParent
          persistKey="upcomingMovies"
          loading={<CardsSkeletonSlider />}
        >
          <LazyUpcomingMovies />
        </LazyRenderForServerParent>
      </PageSection>

      {/* Most Rated TV Shows */}
      <LazyRenderForServerParent
        persistKey="mostRatedTv"
        loading={<HoriSkeletonSlider />}
      >
        <LazyMostVotedTvShows />
      </LazyRenderForServerParent>

      {/* Genres Section */}
      <LazyRenderForServerParent
        persistKey="genres"
        loading={<GenresSkeletonSlider />}
      >
        <LazyGenres />
      </LazyRenderForServerParent>
    </motion.div>
  );
};

export default HomeClient;
