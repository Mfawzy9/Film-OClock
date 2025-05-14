const CastsSkeletonSlider = ({ length = 8 }: { length?: number }) => {
  const dummyArray = Array.from({ length });
  return (
    <main className="relative my-10">
      <div className="flex justify-between items-center mb-3">
        <div className="h-8 w-1/4 bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="flex overflow-x-auto gap-4 py-5 scroll-hidden overflow-y-hidden">
        {dummyArray.map((_, idx) => (
          <div
            key={idx}
            className="w-36 flex-shrink-0 animate-pulse overflow-hidden"
          >
            <div className="w-full h-[225px] bg-gray-700 rounded-lg" />
            <div className="mt-2 h-4 bg-gray-700 rounded w-3/4 mx-auto" />
            <div className="mt-1 h-3 bg-gray-600 rounded w-1/2 mx-auto" />
          </div>
        ))}
      </div>
    </main>
  );
};

export default CastsSkeletonSlider;
