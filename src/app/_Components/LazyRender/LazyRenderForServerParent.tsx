"use client";

import { useInView } from "react-intersection-observer";
import { memo, useState, useEffect, ReactNode } from "react";
import { useOnlineStatus } from "@/app/hooks/useOnlineStatus";
import { ImSpinner9 } from "@react-icons/all-files/im/ImSpinner9";

interface LazyRenderForServerParentProps {
  children: ReactNode;
  loading?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
  persistKey?: string;
}

// Simple memory cache outside component
// const viewedComponents = new Set<string>();

const LazyRenderForServerParent = ({
  children,
  className = "min-h-[400px] flex items-center justify-center",
  loading = (
    <div className={className}>
      <ImSpinner9 className="text-6xl mx-auto animate-spin text-blue-300" />
    </div>
  ),
  threshold = 0.1,
  rootMargin = "0px 0px",
  persistKey,
}: LazyRenderForServerParentProps) => {
  const isOnline = useOnlineStatus();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold,
    rootMargin,
    skip: typeof window === "undefined",
  });

  const [hasBeenInView, setHasBeenInView] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (inView) {
      setHasBeenInView(true);
      // if (persistKey) {
      //   viewedComponents.add(persistKey);
      // }
    }
  }, [inView]);

  if (typeof window === "undefined") return loading;

  if (!hasBeenInView) return loading;

  if (isOnline) {
    return children;
  } else if (!isOnline && !hasBeenInView) {
    return loading;
  } else if (!isOnline && hasBeenInView) {
    return children;
  }

  return <div ref={ref}>{hasBeenInView ? children : loading}</div>;
};

export default memo(LazyRenderForServerParent);

// "use client";

// import { useInView } from "react-intersection-observer";
// import { memo, useState, useEffect, ReactNode } from "react";
// import { useOnlineStatus } from "@/app/hooks/useOnlineStatus";
// import { ImSpinner9 } from "@react-icons/all-files/im/ImSpinner9";

// interface LazyRenderForServerParentProps {
//   children: ReactNode;
//   loading?: ReactNode;
//   threshold?: number;
//   rootMargin?: string;
//   className?: string;
//   persistKey?: string;
// }

// // Simple memory cache outside component
// const viewedComponents = new Set<string>();

// const LazyRenderForServerParent = ({
// children,
// className = "min-h-[400px] flex items-center justify-center",
// loading = (
//   <div className={className}>
//     <ImSpinner9 className="text-6xl mx-auto animate-spin text-blue-300" />
//   </div>
// ),
// threshold = 0.1,
// rootMargin = "0px 0px",
// persistKey,
// }: LazyRenderForServerParentProps) => {
//   const isOnline = useOnlineStatus();
//   const { ref, inView } = useInView({
//     triggerOnce: true,
//     threshold,
//     rootMargin,
//     skip: typeof window === "undefined",
//   });

// const [hasBeenInView, setHasBeenInView] = useState(
//   persistKey ? viewedComponents.has(persistKey) : false,
// );

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     if (inView ) {
//       setHasBeenInView(true);
//       if (persistKey) {
//         viewedComponents.add(persistKey);
//       }
//     }
//   }, [inView, persistKey]);

//   if (typeof window === "undefined") return loading;

// if (!isOnline && !hasBeenInView) return loading;

// if ( isOnline) {
//   return children;
// } else if ( !isOnline && !hasBeenInView) {
//   return loading;
// } else if ( !isOnline && hasBeenInView) {
//   return children;
// }

//   return (
//     <div ref={ref} suppressHydrationWarning>
//       {hasBeenInView ? children : loading}
//     </div>
//   );
// };

// export default memo(LazyRenderForServerParent);
