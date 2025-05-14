import PageSection from "@/app/_Components/PageSection/PageSection";

export default function Loading() {
  return (
    <>
      <div className="min-h-screen absolute w-full -z-10 bg-gray-800 animate-pulse">
        <div
          className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-800/70
            to-transparent"
        />
        <div
          className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-gray-800
            to-transparent"
        />
        <div className="absolute inset-0 bg-gray-800/80" />
      </div>

      {/* content skeleton */}
      <PageSection className="md:!py-0">
        <div
          className={`flex flex-col min-h-screen 4xl:min-h-[unset] md:flex-row items-center
            justify-center relative md:pt-32 gap-6 4xl:pt-48`}
        >
          {/* collection Poster skeleton */}
          <div
            className="w-full max-w-64 xs:max-w-[unset] xs:w-[300px] h-[375px] xs:h-[450px] mx-auto
              md:mx-0 flex-none relative flex flex-col gap-4"
          >
            <div className="w-full h-full bg-gray-700 animate-pulse rounded-md" />
          </div>

          {/* collection Info skeleton */}
          <div className="flex flex-col gap-10 w-full md:max-w-[60%]">
            <div className="h-12 w-4/6 bg-gray-700 rounded animate-pulse"></div>

            <div className="space-y-3">
              <div className="h-6 w-1/4 bg-gray-700 rounded animate-pulse mb-4"></div>
              <div className="h-4 w-full bg-gray-700 rounded animate-pulse"></div>
              <div className="h-4 w-5/6 bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </PageSection>
    </>
  );
}
