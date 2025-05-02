"use client";

import { RefObject } from "react";

const ScrollToSection = ({
  reference,
  className,
}: {
  reference: RefObject<HTMLDivElement | null>;
  className?: string;
}) => {
  const handleScrollToFirstSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (reference.current) {
      const targetPosition = reference.current.offsetTop;
      const startPosition = window.scrollY;
      const distance = targetPosition - startPosition;
      const duration = 1000; // Adjust scroll speed (milliseconds)
      let startTime: number | null = null;

      const easeInOutQuad = (t: number) => {
        return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      };

      const animation = (currentTime: number) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const scrollAmount = easeInOutQuad(progress) * distance + startPosition;

        window.scrollTo(0, scrollAmount);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };
  return (
    <div
      onClick={handleScrollToFirstSection}
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
