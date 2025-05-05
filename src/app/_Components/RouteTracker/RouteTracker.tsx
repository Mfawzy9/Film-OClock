"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

const RouteTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    const segments = pathname.split("/");
    const page = segments[2];
    const subPage = segments[3];

    const isAuthPage =
      page === "auth" && (subPage === "login" || subPage === "signup");
    if (!isAuthPage) {
      sessionStorage.setItem("previousRoute", pathname);
    }
  }, [pathname]);

  return null;
};

export default RouteTracker;
