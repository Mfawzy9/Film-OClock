"use client";
import PageSection from "@/app/_Components/PageSection/PageSection";
import dynamic from "next/dynamic";

const LazyRender = dynamic(
  () => import("@/app/_Components/LazyRender/LazyRender"),
  {
    ssr: false,
  },
);

const ShortDetailsSkeleton = dynamic(
  () => import("@/app/_Components/ShortDetails/ShortDetailsSkeleton"),
  {
    ssr: false,
  },
);

const GenresSkeletonSlider = dynamic(
  () => import("@/app/_Components/GenresSlider/GenresSkeletonSlider"),
  {
    ssr: false,
  },
);

const VideosSkelsetonSlider = dynamic(
  () => import("@/app/_Components/VideosSlider/VideosSkelsetonSlider"),
  {
    ssr: false,
  },
);

const HoriSkeletonSlider = dynamic(
  () => import("@/app/_Components/HoriCardsSlider/HoriSkeletonSlider"),
  {
    ssr: false,
  },
);

const CardsSkeletonSlider = dynamic(
  () => import("@/app/_Components/CardsSlider/CardsSkeletonSlider"),
  {
    ssr: false,
  },
);

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

const LazyWatchlist = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyWatchlist"),
  {
    ssr: false,
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
      <LazyRender
        Component={LazyTopRatedMovies}
        loading={<HoriSkeletonSlider />}
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

export default HomeClient;
