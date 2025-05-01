import PageSection from "../PageSection/PageSection";
import Title from "../Title/Title";

const CardsSkeletons = ({ title }: { title: string }) => {
  return (
    <PageSection>
      <Title title={title} />
      <main
        className="mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4
          lg:grid-cols-5 gap-4 place-items-center min-h-screen relative"
      >
        {[...Array(20)].map((_, idx) => (
          <div
            key={idx}
            className="relative w-full rounded overflow-hidden pb-1 animate-pulse"
          >
            {/* Image Placeholder */}
            <div className="bg-gray-700 w-full h-[330px] rounded" />

            {/* Text Placeholder */}
            <div className="mt-2 px-1 space-y-2">
              <div className="h-4 bg-gray-700 rounded w-3/4" />
              <div className="flex justify-between">
                <div className="h-3 w-1/4 bg-gray-700 rounded" />
                <div className="h-3 w-1/4 bg-gray-700 rounded" />
              </div>
            </div>
          </div>
        ))}
      </main>
    </PageSection>
  );
};

export default CardsSkeletons;
