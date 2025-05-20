"use client";

import { useInView } from "react-intersection-observer";
import { memo, useState, useEffect, ReactElement, ReactNode } from "react";
import { useOnlineStatus } from "@/app/hooks/useOnlineStatus";
import { ImSpinner9 } from "@react-icons/all-files/im/ImSpinner9";

interface LazyRenderForServerComponentsProps {
  children: ReactElement;
  loading?: ReactNode;
  threshold?: number;
  noLazy?: boolean;
  rootMargin?: string;
  className?: string;
  persistKey?: string;
}

// Simple memory cache outside component
const viewedComponents = new Set<string>();

const LazyRenderForServerComponents = ({
  children,
  className = "min-h-[400px] flex items-center justify-center",
  loading = (
    <div className={className}>
      <ImSpinner9 className="text-6xl mx-auto animate-spin text-blue-300" />
    </div>
  ),
  threshold = 0.1,
  noLazy = false,
  rootMargin = "0px 0px",
  persistKey,
}: LazyRenderForServerComponentsProps) => {
  const isOnline = useOnlineStatus();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold,
    rootMargin,
    skip: typeof window === "undefined",
  });

  const [hasBeenInView, setHasBeenInView] = useState(
    persistKey ? viewedComponents.has(persistKey) : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (inView || noLazy) {
      setHasBeenInView(true);
      if (persistKey) {
        viewedComponents.add(persistKey);
      }
    }
  }, [inView, persistKey, noLazy]);

  if (typeof window === "undefined") return loading;

  if (!isOnline && !hasBeenInView && !noLazy) return loading;

  if (noLazy && isOnline) {
    return children;
  } else if (noLazy && !isOnline && !hasBeenInView) {
    return loading;
  } else if (noLazy && !isOnline && hasBeenInView) {
    return children;
  }

  return (
    <div ref={ref} suppressHydrationWarning>
      {hasBeenInView ? children : loading}
    </div>
  );
};

export default memo(LazyRenderForServerComponents);
