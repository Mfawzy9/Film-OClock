import PageSection from "../../PageSection/PageSection";

const WatchHistorySkeleton = ({ length = 4 }: { length?: number }) => {
  return (
    <PageSection className="!pt-10 !pb-3">
      <div className="h-6 w-48 bg-gray-700 animate-pulse rounded-md mb-4" />

      <div className="flex gap-4 flex-nowrap overflow-x-auto custom-scrollbar py-2 px-1">
        {Array.from({ length }).map((_, i) => (
          <div
            key={i}
            className="relative w-52 flex-none bg-gray-900 rounded-md border border-gray-700"
          >
            {/* close icon placeholder */}
            <div className="absolute top-0 right-0 z-20 h-6 w-6 bg-gray-700 rounded-full animate-pulse" />

            {/* image + overlay */}
            <div className="relative rounded-md overflow-hidden">
              <div className="w-[208px] h-[130px] bg-gray-800 animate-pulse rounded-md" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80" />
              <div
                className="absolute z-10 font-bold bottom-0 left-2 h-5 w-32 bg-gray-600 animate-pulse
                  rounded"
              />
              <div className="absolute z-10 top-1 left-1 h-5 w-24 bg-gray-700 animate-pulse rounded" />
            </div>

            {/* Details section */}
            <div className="flex flex-col mt-2 gap-1.5 px-2 pb-1">
              {/* progress bar */}
              <div className="bg-gray-700 rounded-full h-2 w-full overflow-hidden">
                <div className="h-2 bg-blue-600 animate-pulse w-[70%]" />
              </div>

              {/* watched / total */}
              <div className="flex justify-between text-xs text-gray-500">
                <div className="h-3 w-10 bg-gray-700 animate-pulse rounded" />
                <div className="h-3 w-10 bg-gray-700 animate-pulse rounded" />
              </div>

              {/* duration */}
              <div className="flex justify-between text-gray-500 border-t border-dashed border-gray-700 pt-2">
                <div className="h-3 w-16 bg-gray-700 animate-pulse rounded self-start" />
                <div className="h-3 w-16 bg-gray-700 animate-pulse rounded self-start" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageSection>
  );
};

export default WatchHistorySkeleton;
