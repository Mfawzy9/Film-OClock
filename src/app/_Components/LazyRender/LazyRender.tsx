"use client";

import { useInView } from "react-intersection-observer";
import { ComponentType, memo, useState, useEffect } from "react";
import { useOnlineStatus } from "@/app/hooks/useOnlineStatus";
import { ImSpinner9 } from "@react-icons/all-files/im/ImSpinner9";
import { LRUCache } from "lru-cache";
interface LazyRenderProps {
  Component: ComponentType<any>;
  loading?: React.ReactNode;
  props?: any;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  persistKey?: string;
}

// Simple memory cache outside component
const viewedComponents = new LRUCache<string, true>({
  max: 100,
  ttl: 1000 * 60 * 30,
});

const LazyRender = ({
  Component,
  className = "min-h-[400px] flex items-center justify-center",
  loading = (
    <div className={className}>
      <ImSpinner9 className="text-6xl mx-auto animate-spin text-blue-300" />
    </div>
  ),
  props = {},
  threshold = 0.1,
  rootMargin = "0px 0px",
  persistKey,
}: LazyRenderProps) => {
  const isOnline = useOnlineStatus();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold,
    rootMargin,
  });

  const [hasBeenInView, setHasBeenInView] = useState(
    persistKey ? viewedComponents.has(persistKey) : false,
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (inView) {
      setHasBeenInView(true);
      if (persistKey) {
        viewedComponents.set(persistKey || "", true);
      }
    }
  }, [inView, persistKey]);

  if (!isOnline && !hasBeenInView) {
    return loading;
  } else if (!isOnline && hasBeenInView) {
    return <Component {...props} />;
  }

  return (
    <div ref={ref}>
      {hasBeenInView && isOnline ? <Component {...props} /> : loading}
    </div>
  );
};

export default memo(LazyRender);
