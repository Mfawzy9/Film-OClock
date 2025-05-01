import PageSection from "../PageSection/PageSection";

const ShortDetailsSkeleton = () => {
  return (
    <PageSection className="!py-0 mt-14">
      <main className={"px-2 max-w-screen-2xl mx-auto z-10 rounded-md "}>
        <div className="relative">
          {/* Placeholder for Watchlist/Favorite dropdown */}
          <div className="absolute top-2 end-2 z-20">
            <div className="w-8 h-8 bg-gray-700 rounded-md animate-pulse" />
          </div>

          {/* Main card area */}
          <div
            className="relative flex items-end min-h-[30vh] sm:min-h-[40vh] md:min-h-[60vh]
              xl:min-h-[70vh] 4xl:min-h-[560px] px-2 sm:px-3 pb-2 rounded-md border-2
              border-gray-700 overflow-hidden group transition-all duration-300"
          >
            {/* Fake background image */}
            <div className="absolute inset-0 bg-gray-800 animate-pulse z-0" />
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/90 from-15% via-transparent
                to-black/90 z-1"
            />

            {/* Content skeleton */}
            <div className="flex flex-col gap-2 relative z-10 w-full">
              <div className="h-6 sm:h-8 w-1/2 bg-gray-700 rounded-md animate-pulse" />
              <div className="h-4 sm:h-5 w-2/3 bg-gray-700 rounded-md animate-pulse" />
              <div className="flex items-center justify-between gap-2 mt-1">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-14 bg-gray-700 rounded-md animate-pulse" />
                  <div className="h-4 w-14 bg-gray-700 rounded-md animate-pulse" />
                </div>
                <div className="h-4 w-24 bg-gray-700 rounded-md animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageSection>
  );
};

export default ShortDetailsSkeleton;
