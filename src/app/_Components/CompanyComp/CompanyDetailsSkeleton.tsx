const CompanyDetailsSkeleton = () => {
  return (
    <div className="bg-gray-900 rounded-xl p-3 mb-10 shadow-lg border border-gray-800 animate-pulse">
      <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
        {/* Logo Skeleton */}
        <div
          className="flex-shrink-0 w-40 h-40 rounded-lg bg-gray-800 flex items-center justify-center
            border border-gray-700 p-1"
        >
          <div className="w-32 h-32 bg-gray-700 rounded" />
        </div>

        {/* Text Skeleton */}
        <div className="flex-1 space-y-4 text-gray-200 w-full">
          {/* Title */}
          <div className="h-8 w-3/4 bg-gray-700 rounded" />

          {/* Headquarters */}
          <div>
            <div className="h-4 w-1/3 bg-gray-600 rounded mb-1" />
            <div className="h-6 w-1/2 bg-gray-700 rounded" />
          </div>

          {/* Country */}
          <div>
            <div className="h-4 w-1/3 bg-gray-600 rounded mb-1" />
            <div className="h-6 w-1/4 bg-gray-700 rounded" />
          </div>

          {/* Description */}
          <div>
            <div className="h-4 w-1/3 bg-gray-600 rounded mb-2" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-700 rounded" />
              <div className="h-4 w-11/12 bg-gray-700 rounded" />
              <div className="h-4 w-2/3 bg-gray-700 rounded" />
            </div>
          </div>

          {/* Visit Website Button */}
          <div className="mt-6">
            <div className="h-10 w-48 bg-blue-800 rounded-lg" />
          </div>

          {/* Parent Company */}
          <div className="mt-4 pt-4 border-t border-gray-800 space-y-2">
            <div className="h-6 w-1/3 bg-gray-600 rounded" />
            <div className="flex items-center gap-4">
              <div className="w-24 h-12 bg-gray-700 rounded" />
              <div className="h-5 w-1/4 bg-gray-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsSkeleton;
