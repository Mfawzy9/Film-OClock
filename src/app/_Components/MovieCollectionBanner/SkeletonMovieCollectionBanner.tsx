const SkeletonMovieCollectionBanner = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div className={className ?? ""}>
      <div className="flex justify-between items-center mb-4">
        <div className="h-8 w-1/5 bg-gray-700 rounded animate-pulse" />
      </div>
      <div className="relative w-full h-80 rounded-lg overflow-hidden block border border-gray-800">
        {/* Fake backdrop */}
        <div className="absolute inset-0 w-full h-full bg-gray-800 animate-pulse rounded-lg" />

        {/* Overlay content */}
        <div
          className="relative z-10 flex flex-col justify-center items-center text-center gap-6 p-2
            xs:p-4 sm:p-6 h-full bg-black/80 animate-pulse"
        >
          <div className="space-y-2 w-full max-w-md mx-auto">
            <div className="h-6 bg-gray-700 rounded w-2/3 mx-auto" />
            <div className="h-4 bg-gray-700 rounded w-3/4 mx-auto" />
          </div>
          <div className="h-10 w-32 bg-gray-700 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonMovieCollectionBanner;
