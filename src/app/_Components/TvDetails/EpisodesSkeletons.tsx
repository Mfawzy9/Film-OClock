import { FaRegPlayCircle } from "@react-icons/all-files/fa/FaRegPlayCircle";

const EpisodesSkeletons = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="h-8 w-24 bg-gray-700 rounded animate-pulse"></div>
      </div>

      <main className="pt-8">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-y-20 gap-x-4
            mt-8 place-items-center"
        >
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="relative flex flex-col rounded-xl bg-gradient-to-br from-gray-800 to-gray-900
                shadow-lg cursor-pointer animate-pulse max-w-80 sm:max-w-[unset] w-full
                xs:min-w-80 sm:min-w-full min-h-[386px]"
            >
              {/* Image placeholder */}
              <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl bg-gray-700">
                <div className="absolute inset-0 bg-gray-600"></div>
              </div>

              {/* Content placeholder */}
              <div className="p-6">
                <div className="h-5 w-1/2 bg-gray-700 rounded mb-3"></div>
                <div className="h-6 w-3/4 bg-gray-600 rounded mb-4"></div>

                {/* Description placeholder */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-700 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-700 rounded"></div>
                  <div className="h-4 w-2/3 bg-gray-700 rounded"></div>
                </div>
              </div>

              {/* Buttons placeholder */}
              <div className="p-6 pt-0 flex justify-between flex-wrap gap-3">
                <div className="grow h-10 bg-gray-700 rounded-lg"></div>
                <div className="grow h-10 bg-gray-700 rounded-lg flex items-center justify-center">
                  <FaRegPlayCircle className="text-gray-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
};

export default EpisodesSkeletons;
