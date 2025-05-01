const VideosDetailsSkeletons = ({ length = 4 }: { length?: number }) => {
  return (
    <>
      <div className="h-8 w-1/5 bg-gray-700 rounded animate-pulse"></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
        {[...Array(length)].map((_, idx) => (
          <div
            key={idx}
            className="cursor-pointer group overflow-hidden bg-gray-800 rounded-md p-1 animate-pulse"
          >
            {/* Video thumbnail placeholder */}
            <div className="relative aspect-video bg-gray-700 rounded-md overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 bg-gray-600 rounded-full"></div>
              </div>
              {/* Duration placeholder */}
              <div className="absolute bottom-0 end-0 bg-gray-600/80 py-1 px-2 h-6 w-16"></div>
            </div>
            {/* Title placeholder */}
            <div className="mt-2 h-5 bg-gray-700 rounded w-3/4 ps-2"></div>
          </div>
        ))}
      </div>
    </>
  );
};

export default VideosDetailsSkeletons;
