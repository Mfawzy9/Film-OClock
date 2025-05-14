const ProfileDetailsSkeleton = () => {
  return (
    <main className="py-8 min-h-[270px]">
      <div className="bg-black shadow-blueGlow shadow-gray-500/60 mt-4 overflow-hidden sm:rounded-lg">
        {/* Title & Subtitle Skeleton */}
        <div className="px-4 py-5 sm:px-6 space-y-2">
          <div className="h-6 w-40 bg-gray-700 rounded animate-pulse" />
          <div className="h-4 w-60 bg-gray-700 rounded animate-pulse" />
        </div>

        {/* Table Rows Skeleton */}
        <div className="border-t border-gray-200">
          <dl>
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
              >
                {/* Label Skeleton */}
                <dt className="h-4 w-24 bg-gray-700 rounded animate-pulse" />

                {/* Value Skeleton */}
                <dd className="mt-2 sm:mt-0 sm:col-span-2">
                  <div className="h-4 w-48 bg-gray-700 rounded animate-pulse" />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </main>
  );
};

export default ProfileDetailsSkeleton;
