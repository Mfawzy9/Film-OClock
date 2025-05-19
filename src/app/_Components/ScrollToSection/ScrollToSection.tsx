const ScrollToSection = ({ className }: { className?: string }) => {
  return (
    <div
      className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10 4xl:hidden
        ${className ?? ""}`}
    >
      <div className="scrolldown">
        <div className="chevrons">
          <div className="chevrondown" />
          <div className="chevrondown" />
        </div>
      </div>
    </div>
  );
};

export default ScrollToSection;
