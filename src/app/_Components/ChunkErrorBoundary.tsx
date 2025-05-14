// components/ChunkErrorBoundary.tsx
"use client";

import { useEffect, useState } from "react";
import PublicError from "./PublicError/PublicError";

export default function ChunkErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (isChunkLoadError(event)) {
        setError(
          new Error(
            "Something went wrong. Please check your internet connection.",
          ),
        );
      }
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      if (isChunkLoadRejection(event)) {
        setError(
          new Error(
            "Something went wrong. Please check your internet connection.",
          ),
        );
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  if (error) {
    return <PublicError />;
  }

  return <>{children}</>;
}

function isChunkLoadError(event: ErrorEvent): boolean {
  return (
    event.message?.includes("Failed to fetch dynamically imported module") ||
    event.message?.includes("Failed to load chunk") ||
    event.message?.includes("Importing a module script failed")
  );
}

function isChunkLoadRejection(event: PromiseRejectionEvent): boolean {
  const reason = event.reason?.message || event.reason;
  return (
    typeof reason === "string" &&
    (reason.includes("Loading chunk") ||
      reason.includes("Failed to fetch dynamically imported module") ||
      reason.includes("Failed to load"))
  );
}
