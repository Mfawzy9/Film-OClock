"use client";
import PageSection from "@/app/_Components/PageSection/PageSection";
import dynamic from "next/dynamic";
import LazyRender from "../../LazyRender/LazyRender";

// const LazyRender = dynamic(
//   () => import("@/app/_Components/LazyRender/LazyRender"),
//   {
//     ssr: false,
//     loading: () => (
//       <div className="flex items-center h-full min-h-[465px]">
//         <FaCircle className="text-6xl mx-auto animate-ping text-blue-300" />
//       </div>
//     ),
//   },
// );

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

const LazyTopRatedMovies = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyTopRatedMovies"),
  {
    loading: () => <HoriSkeletonSlider />,
  },
);

const LazyLastWatched = dynamic(
  () => import("@/app/_Components/Home/WatchHistory/LastWatched"),
  {
    loading: () => <ShortDetailsSkeleton />,
  },
);

const LazyTrendingTvShows = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyTrendingTvShows"),
  {
    loading: () => <CardsSkeletonSlider />,
  },
);

const LazyWatchlist = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyWatchlist"),
);

const LazyLatestTrailers = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyLatestTrailers"),
  {
    loading: () => <VideosSkelsetonSlider />,
  },
);

const LazyUpcomingMovies = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyUpcomingMovies"),
  {
    loading: () => <CardsSkeletonSlider />,
  },
);

const LazyMostVotedTvShows = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyMostVotedTvShows"),
  {
    loading: () => <HoriSkeletonSlider />,
  },
);

const LazyGenres = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyGenres"),
  {
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
