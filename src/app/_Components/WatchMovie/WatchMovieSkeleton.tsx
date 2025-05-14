import CardsSkeletonSlider from "../CardsSlider/CardsSkeletonSlider";
import CastsSkeletonSlider from "../Casts/CastsSkeletonSlider";
import PageSection from "../PageSection/PageSection";

const WatchMovieSkeleton = () => {
  return (
    <>
      {/* Background image and overlays */}
      <div className="min-h-screen absolute w-full 4xl:py-40 -z-10">
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      {/* Content Section */}
      <PageSection className="xs:px-7 flex flex-col gap-16">
        <main className="flex flex-col gap-5 animate-pulse">
          {/* Title Skeleton */}
          <div className="w-3/4 h-8 bg-gray-700 rounded-md" />

          {/* Metadata Skeleton Row */}
          <div className="flex items-center gap-2 flex-wrap">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-700 rounded-full" />
                <div className="h-4 w-12 bg-gray-700 rounded" />
              </div>
            ))}
          </div>

          {/* Genre Tags Skeleton */}
          <div className="flex items-center gap-2 flex-wrap">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-6 w-20 bg-gray-800 rounded px-2" />
            ))}
          </div>

          {/* Overview Section Skeleton */}
          <div>
            <div className="h-6 w-28 bg-gray-600 rounded mb-3" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-full bg-gray-700 rounded" />
              ))}
            </div>
          </div>
        </main>
        <CastsSkeletonSlider />

        <main className="flex flex-col gap-5">
          {/* Top bar with server info and dropdown */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Warning text placeholder */}
            <div className="h-5 w-60 bg-yellow-300/40 animate-pulse rounded-md" />

            {/* Select dropdown placeholder */}
            <div className="h-10 w-40 bg-gray-700 animate-pulse rounded-md" />
          </div>

          {/* Video iframe placeholder */}
          <div
            className="w-full aspect-video bg-gray-800 animate-pulse rounded-md shadow-md
              shadow-blue-900/40"
          />
        </main>
        <CardsSkeletonSlider />
        <CardsSkeletonSlider />
      </PageSection>
    </>
  );
};

export default WatchMovieSkeleton;
