import PageSection from "../PageSection/PageSection";

const PersonDetailsSkeleton = () => {
  return (
    <PageSection>
      <main className="flex gap-12 flex-col md:flex-row items-center md:items-start">
        {/* Left Side: Poster & Socials */}
        <div className="flex flex-col items-center gap-4">
          {/* Poster Skeleton */}
          <div className="w-[250px] h-[375px] bg-gray-700 rounded-md animate-pulse" />

          {/* Social Icons Skeleton */}
          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 bg-gray-700 rounded animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Right Side: Info Skeleton */}
        <div className="flex flex-col gap-5 w-full max-w-2xl">
          {/* Title */}
          <div className="h-8 w-52 bg-gray-700 rounded-md animate-pulse" />

          {/* Info Fields */}
          <div className="flex flex-col gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-gray-700 animate-pulse" />
                <div className="w-36 h-4 bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>

          {/* Latest Works (Optional Block) */}
          <div>
            <div className="h-5 w-32 bg-gray-700 rounded relative animate-pulse mb-2" />
            <div className="flex flex-wrap gap-2 animate-pulse">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="w-[75px] h-[110px] bg-gray-700 rounded-md"
                />
              ))}
            </div>
          </div>

          {/* Biography */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="w-40 h-5 bg-gray-700 rounded animate-pulse" />
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="w-full h-4 bg-gray-700 rounded animate-pulse"
                />
              ))}
            </div>
            <div className="w-32 h-4 bg-gray-700 rounded animate-pulse mt-2" />
          </div>
        </div>
      </main>
    </PageSection>
  );
};

export default PersonDetailsSkeleton;
