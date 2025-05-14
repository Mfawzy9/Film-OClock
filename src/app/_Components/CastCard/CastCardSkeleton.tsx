const CastCardSkeleton = () => {
  return (
    <div className="block rounded-lg shadow bg-gray-900 shadow-blue-700/70 animate-pulse">
      {/* backdrop */}
      <div className="h-28 overflow-hidden rounded-t-lg relative">
        <div className="h-full w-full bg-gray-700 object-cover object-bottom" />
        <span className="absolute bottom-0 left-0 w-full h-full bg-black/75" />
      </div>

      {/* profile image */}
      <div
        className="mx-auto flex justify-center items-center -mt-20 w-32 h-32 overflow-hidden
          rounded-full border-2 border-gray-500 bg-black relative z-10"
      >
        <div className="w-full h-full bg-gray-700 rounded-full" />
      </div>

      {/* content */}
      <div className="p-3">
        {/* name */}
        <div className="h-5 w-3/4 bg-gray-600 rounded mx-auto mb-3" />

        {/* attributes */}
        <div className="flex items-center justify-center md:justify-start flex-nowrap gap-2">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-800 px-2 py-1 text-sm rounded flex flex-col gap-1 border md:grow
                border-gray-600 h-[50px]"
            >
              <div className="h-3 w-20 bg-gray-500 rounded" />
              <div className="h-4 w-16 bg-gray-400 rounded" />
            </div>
          ))}
        </div>

        {/* latest works */}
        <div className="flex flex-col gap-2 mt-2">
          <div
            className="h-4 w-24 bg-gray-600 rounded relative after:content-[''] after:absolute
              after:-bottom-1 after:start-0 after:w-6 after:h-1 after:bg-blue-800 mb-2"
          />

          <div className="flex flex-wrap justify-between gap-4">
            {/* image placeholders */}
            <div className="flex flex-wrap gap-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-[55px] h-[90px] bg-gray-700 rounded-md"
                />
              ))}
            </div>

            {/* view profile button */}
            <div className="h-10 w-36 bg-blue-700 rounded self-end" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastCardSkeleton;
