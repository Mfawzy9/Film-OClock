const TvDetailsSkeleton = () => {
  return (
    <>
      <div className="min-h-screen absolute w-full -z-10">
        <div className="w-full h-full absolute inset-0 bg-black/80 animate-pulse" />
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent" />
      </div>

      <section className="px-3 sm:px-7 pt-28 md:pt-0 lg:max-w-screen-xl mx-auto mb-24">
        <div
          className="flex flex-col min-h-screen 3xl:min-h-[unset] md:flex-row md:items-center
            justify-center relative md:pt-32 gap-6 4xl:pt-48"
        >
          {/* Poster Placeholder */}
          <div className="w-[230px] xs:w-[300px] mx-auto md:mx-0 flex-none relative flex flex-col gap-4">
            <div
              className="w-[230px] xs:w-[300px] h-[366px] xs:h-[450px] bg-gray-800 rounded-t-md
                animate-pulse"
            />
            <div className="h-10 bg-gray-800 rounded-b-md animate-pulse -mt-3" />
            <div className="flex justify-center">
              <ul className="flex gap-4">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-7 h-7 bg-gray-700 rounded animate-pulse"
                  />
                ))}
              </ul>
            </div>
          </div>

          {/* Info Placeholder */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="h-8 w-2/5 bg-gray-700 rounded animate-pulse" />
            <div className="flex items-center gap-2 flex-wrap">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-5 bg-gray-800 rounded animate-pulse"
                />
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-6 w-16 bg-gray-800 rounded-md animate-pulse"
                />
              ))}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-5 w-24 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-5 w-24 bg-gray-700 rounded animate-pulse" />
                <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="h-4 w-16 bg-gray-700 rounded animate-pulse" />
              <div className="h-4 w-10 bg-gray-700 rounded animate-pulse" />
            </div>

            <div className="w-3/4 h-4 bg-gray-700 rounded animate-pulse" />

            {/*  */}
            <div className="h-5 w-32 bg-gray-600 rounded animate-pulse" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-4 bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
            <div className="flex items-center justify-center xs:justify-start gap-3">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-9 w-9 bg-gray-700 rounded-full animate-pulse"
                />
              ))}
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="h-12 w-32 bg-gray-700 rounded-2xl animate-pulse" />
              <div className="w-14 h-14 rounded-full bg-gray-700 animate-pulse" />
            </div>
            <div className="h-5 w-1/5 bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      </section>
    </>
  );
};

export default TvDetailsSkeleton;
