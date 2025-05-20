"use client";
import PageSection from "@/app/_Components/PageSection/PageSection";
import dynamic from "next/dynamic";
import LazyRenderForServerComponents from "../../LazyRender/LazyRenderForServerComponents";
// import CardsSkeletonSlider from "../../CardsSlider/CardsSkeletonSlider";
// import GenresSkeletonSlider from "../../GenresSlider/GenresSkeletonSlider";
// import HoriSkeletonSlider from "../../HoriCardsSlider/HoriSkeletonSlider";
import ShortDetailsSkeleton from "../../ShortDetails/ShortDetailsSkeleton";
// import VideosSkelsetonSlider from "../../VideosSlider/VideosSkelsetonSlider";
import LazyWatchlist from "../LazySections/LazyWatchlist";

// const LazyWatchlist = dynamic(() => import("../LazySections/LazyWatchlist"), {
//   ssr: false,
//   loading: () => (
//     <div
//       className="bg-gray-900 border border-gray-700 rounded-lg min-h-[460px] flex items-center
//         justify-center"
//     >
//       <FaCircle className="text-6xl mx-auto animate-ping text-blue-300" />
//     </div>
//   ),
// });

const LazyTopRatedMovies = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyTopRatedMovies"),
  {
    ssr: false,
  },
);

const LazyLastWatched = dynamic(
  () => import("@/app/_Components/Home/WatchHistory/LastWatched"),
  {
    ssr: false,
  },
);

const LazyTrendingTvShows = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyTrendingTvShows"),
  {
    ssr: false,
  },
);

const LazyLatestTrailers = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyLatestTrailers"),
  {
    ssr: false,
  },
);

const LazyUpcomingMovies = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyUpcomingMovies"),
  {
    ssr: false,
  },
);

const LazyMostVotedTvShows = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyMostVotedTvShows"),
  {
    ssr: false,
  },
);

const LazyGenres = dynamic(
  () => import("@/app/_Components/Home/LazySections/LazyGenres"),
  {
    ssr: false,
  },
);

const HomeClient = () => {
  return (
    <>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* top rated movies */}
      <LazyRenderForServerComponents>
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
        <LazyRenderForServerComponents>
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
      <LazyRenderForServerComponents>
        <LazyLatestTrailers />
      </LazyRenderForServerComponents>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* Upcoming Movies */}
      <PageSection className="!py-5">
        <LazyRenderForServerComponents>
          <LazyUpcomingMovies />
        </LazyRenderForServerComponents>
      </PageSection>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* most rated Tv Shows */}
      <LazyRenderForServerComponents>
        <LazyMostVotedTvShows />
      </LazyRenderForServerComponents>
      {/* ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- ----- */}
      {/* genres Section */}
      <LazyRenderForServerComponents>
        <LazyGenres />
      </LazyRenderForServerComponents>
    </>
  );
};

export default HomeClient;
