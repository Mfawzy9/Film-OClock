const HomeSliderSkeleton = () => {
  return (
    <section className="px-3 sm:px-7 md:max-w-screen-sm lg:max-w-screen-xl mx-auto">
      <div
        className="flex min-h-screen xs:py-10 4xl:min-h-[unset] items-center justify-center
          xl:justify-around relative gap-6 4xl:pt-48"
      >
        {/* Left Text Skeleton */}
        <div
          className="flex flex-col items-center sm:items-start gap-4 w-full lg:max-w-screen-sm
            animate-pulse"
        >
          <div className="h-8 w-2/3 bg-gray-700 rounded" />
          <div className="flex flex-wrap gap-2">
            {Array(3)
              .fill(0)
              .map((_, idx) => (
                <span
                  key={`skeleton-genre-${idx}`}
                  className="bg-gray-700 text-transparent px-1 sm:font-semibold animate-pulse"
                >
                  Genre
                </span>
              ))}
          </div>

          <div className="space-y-2 w-full">
            <div className="h-5 w-full bg-gray-800 rounded" />
            <div className="h-5 w-full bg-gray-800 rounded" />
            <div className="h-5 w-3/4 bg-gray-800 rounded" />
          </div>

          {/* Buttons skeleton */}
          <div className="w-full">
            <div className="flex flex-wrap justify-center xs:justify-start items-center gap-5 mt-2">
              <div className="w-32 h-12 bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="w-32 h-12 bg-gray-700 rounded-xl animate-pulse"></div>
              <div className="w-14 h-14 bg-gray-700 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Poster Skeleton */}
        <div className="hidden lg:block w-[300px] h-[450px] bg-gray-700 rounded-md animate-pulse" />
      </div>
    </section>
  );
};

export default HomeSliderSkeleton;
