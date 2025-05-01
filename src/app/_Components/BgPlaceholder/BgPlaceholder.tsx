const BgPlaceholder = () => {
  return (
    <div
      className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-black via-gray-700
        to-black rounded-md z-10 overflow-hidden"
    >
      <div className="relative w-full h-full overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent
            via-gray-500/30 to-transparent animate-shimmer"
        />
      </div>
    </div>
  );
};

export default BgPlaceholder;
