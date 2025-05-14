import { useEffect, useState } from "react";

const DESKTOP_BREAKPOINT = 1024;

export default function useIsDesktop(): boolean {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.innerWidth >= DESKTOP_BREAKPOINT
      : true,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const isNowDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
      setIsDesktop((prev) => (prev !== isNowDesktop ? isNowDesktop : prev));
    };

    // Use `resize` event throttled to every ~150ms to prevent unnecessary re-renders (debouncing)
    let timeout: ReturnType<typeof setTimeout> | null = null;
    const throttledResize = () => {
      if (timeout) return;
      timeout = setTimeout(() => {
        handleResize();
        timeout = null;
      }, 150);
    };

    window.addEventListener("resize", throttledResize);
    return () => {
      window.removeEventListener("resize", throttledResize);
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  return isDesktop;
}
