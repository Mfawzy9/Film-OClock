"use client";
import PageSection from "@/app/_Components/PageSection/PageSection";
import dynamic from "next/dynamic";
import LazyRenderForServerComponents from "../../LazyRender/LazyRenderForServerComponents";
import CardsSkeletonSlider from "../../CardsSlider/CardsSkeletonSlider";
import GenresSkeletonSlider from "../../GenresSlider/GenresSkeletonSlider";
import HoriSkeletonSlider from "../../HoriCardsSlider/HoriSkeletonSlider";
import ShortDetailsSkeleton from "../../ShortDetails/ShortDetailsSkeleton";
import VideosSkelsetonSlider from "../../VideosSlider/VideosSkelsetonSlider";
import LazyWatchlist from "../LazySections/LazyWatchlist";

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
    <>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* top rated movies */}
      <LazyRenderForServerComponents loading={<HoriSkeletonSlider />}>
        <LazyTopRatedMovies />
      </LazyRenderForServerComponents>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* last watched show */}
      <LazyRenderForServerComponents
        loading={<ShortDetailsSkeleton className="!py-0 mt-14" />}
      >
        <LazyLastWatched />
      </LazyRenderForServerComponents>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* trending today tv shows */}
      <PageSection>
        <LazyRenderForServerComponents loading={<CardsSkeletonSlider />}>
          <LazyTrendingTvShows />
        </LazyRenderForServerComponents>
      </PageSection>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* Watchlist */}
      <PageSection className="!py-5">
        <LazyWatchlist />
      </PageSection>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* latest trailers */}
      <LazyRenderForServerComponents loading={<VideosSkelsetonSlider />}>
        <LazyLatestTrailers />
      </LazyRenderForServerComponents>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* Upcoming Movies */}
      <PageSection className="!py-5">
        <LazyRenderForServerComponents loading={<CardsSkeletonSlider />}>
          <LazyUpcomingMovies />
        </LazyRenderForServerComponents>
      </PageSection>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* most rated Tv Shows */}
      <LazyRenderForServerComponents loading={<HoriSkeletonSlider />}>
        <LazyMostVotedTvShows />
      </LazyRenderForServerComponents>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* genres Section */}
      <LazyRenderForServerComponents loading={<GenresSkeletonSlider />}>
        <LazyGenres />
      </LazyRenderForServerComponents>
    </>
  );
};

export default HomeClient;
