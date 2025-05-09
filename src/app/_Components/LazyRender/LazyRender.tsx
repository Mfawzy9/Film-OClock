"use client";

import { useInView } from "react-intersection-observer";
import { ComponentType, memo, useState, useEffect } from "react";
import { ImSpinner9 } from "react-icons/im";
import { useOnlineStatus } from "@/app/hooks/useOnlineStatus";

interface LazyRenderProps {
  Component: ComponentType<any>;
  loading?: React.ReactNode;
  props?: any;
  threshold?: number;
  noLazy?: boolean;
  rootMargin?: string;
  className?: string;
  persistKey?: string;
}

// Simple memory cache outside component
const viewedComponents = new Set<string>();

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
  noLazy = false,
  rootMargin = "600px 0px",
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
    if (inView) {
      setHasBeenInView(true);
      if (persistKey) {
        viewedComponents.add(persistKey);
      }
    }
  }, [inView, persistKey]);

  if (!isOnline && !hasBeenInView && !noLazy) return loading;

  if (noLazy) {
    return <Component {...props} />;
  }

  return (
    <div ref={ref}>{hasBeenInView ? <Component {...props} /> : loading}</div>
  );
};

export default memo(LazyRender);
