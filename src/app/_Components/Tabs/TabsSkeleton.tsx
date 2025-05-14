const TabsSkeleton = ({ length = 3 }: { length?: number }) => {
  return (
    <main
      className="mt-5 flex flex-wrap gap-3 lg:max-w-screen-xl mx-auto justify-center
        bg-gradient-to-t from-blue-700/15 via-black to-blue-700/35 sm:text-lg
        font-semibold rounded shadow-sm shadow-gray-600 p-2"
    >
      {Array.from({ length }).map((_, idx) => (
        <div
          key={idx}
          className="h-6 w-24 xs:w-28 bg-gray-700 rounded-md animate-pulse"
        />
      ))}
    </main>
  );
};

export default TabsSkeleton;
