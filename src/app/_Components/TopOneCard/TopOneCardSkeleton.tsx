const TopOneCardSkeleton = () => {
  return (
    <section>
      <div
        className="italic animate-pulse mb-4 mx-auto lg:mx-0 w-fit lg:-mb-6 relative
          after:content-[''] after:animate-bounce after:absolute after:-bottom-3
          after:start-0 after:w-14 lg:after:h-1 after:bg-blue-800"
      >
        <div className="h-6 w-40 bg-gray-700 rounded" />
      </div>

      <main className="flex flex-col lg:flex-row items-center rounded-md max-w-[992px] mx-auto gap-4">
        {/* Skeleton for Top Actor Details */}
        <div
          className="bg-black flex flex-col gap-3 grow lg:h-72 shadow-blueGlow -me-2 ps-4 pe-6 py-2
            rounded-md animate-pulse"
        >
          {/* Name and Social Links */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="h-6 w-32 bg-gray-700 rounded" />
              <div className="h-4 w-5 bg-gray-600 rounded" />
            </div>
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-6 w-6 bg-gray-700 rounded" />
              ))}
            </div>
          </div>

          {/* Attribute Skeletons */}
          <div className="flex items-center flex-wrap gap-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-900 px-3 py-2 text-sm rounded flex flex-col gap-2 border lg:grow
                  border-gray-600 w-full max-w-44 lg:max-w-[115px] h-[60px]"
              >
                <div className="h-3 w-24 bg-gray-600 rounded" />
                <div className="h-4 w-20 bg-gray-500 rounded" />
              </div>
            ))}
          </div>

          {/* Latest Works */}
          <div className="flex flex-wrap justify-between gap-4 mt-2">
            <main className="flex flex-col gap-2">
              <div
                className="h-5 w-32 bg-gray-700 rounded relative after:content-[''] after:absolute
                  after:-bottom-1 after:start-0 after:w-12 after:h-1 after:bg-blue-800 mb-2"
              />
              <div className="flex flex-wrap gap-2">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="w-[75px] h-[110px] bg-gray-700 rounded-md"
                  />
                ))}
              </div>
            </main>

            {/* View Profile Button */}
            <div className="h-9 w-40 bg-blue-700 rounded self-end" />
          </div>
        </div>

        {/* Skeleton for Profile Image */}
        <div
          className="w-[250px] h-[375px] bg-gray-800 rounded-md border border-gray-600 animate-pulse
            order-first lg:order-last"
        />
      </main>
    </section>
  );
};

export default TopOneCardSkeleton;
