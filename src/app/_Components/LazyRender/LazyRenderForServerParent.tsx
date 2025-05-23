"use client";

import { useInView } from "react-intersection-observer";
import { useEffect, useState, ReactNode } from "react";
import { useOnlineStatus } from "@/app/hooks/useOnlineStatus";
import { ImSpinner9 } from "@react-icons/all-files/im/ImSpinner9";
import { LRUCache } from "lru-cache";

// Cache seen components (for persistKey)
const viewedComponents = new LRUCache<string, true>({
  max: 100,
  ttl: 1000 * 60 * 30,
});

interface LazyRenderForServerParentProps {
  children: ReactNode;
  loading?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  persistKey?: string;
  className?: string;
}

export default function LazyRenderForServerParent({
  children,
  className = "min-h-[400px] flex items-center justify-center",
  loading = (
    <div className={className}>
      <ImSpinner9 className="text-6xl mx-auto animate-spin text-blue-300" />
    </div>
  ),
  threshold = 0.1,
  rootMargin = "0px",
  persistKey,
}: LazyRenderForServerParentProps) {
  const [isClient, setIsClient] = useState(false);
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
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (inView) {
      setHasBeenInView(true);
      if (persistKey) {
        viewedComponents.set(persistKey || "", true);
      }
    }
  }, [inView, persistKey]);

  if (!isClient) return loading;

  if (!isOnline && !hasBeenInView) return loading;

  return <div ref={ref}>{hasBeenInView ? children : loading}</div>;
}
