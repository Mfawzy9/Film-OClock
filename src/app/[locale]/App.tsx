"use client";
import "./globals.css";
import store from "@/lib/Redux/store";
import { Provider } from "react-redux";
import Navbar from "../_Components/Navbar/Navbar";
import VideoModal from "../_Components/VideoModal/VideoModal";
import ImgModal from "../_Components/ImgModal/ImgModal";
import { useEffect } from "react";
import { listenToAuthChanges } from "@/lib/firebase/authService";
import BackToTop from "../_Components/BackToTop/BackToTop";
import LibraryInit from "../_Components/Library/LibraryInit/LibraryInit";
import RouteTracker from "../_Components/RouteTracker/RouteTracker";
import { ProgressProvider } from "@bprogress/next/app";
import useIsDesktop from "../hooks/useIsDesktop";
import { Toaster, ToasterProps } from "sonner";
import NoInternetToast from "../_Components/NoInternetToast/NoInternetToast";
import { AppProgressProviderProps } from "@bprogress/next";

const App = ({
  children,
  isArabic,
}: {
  children: React.ReactNode;
  isArabic: boolean;
}) => {
  const isDesktop = useIsDesktop();
  useEffect(() => {
    let unsub: () => void;

    listenToAuthChanges().then((unsubscribe) => {
      unsub = unsubscribe;
    });

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const progressProviderOptions: AppProgressProviderProps = {
    color: "#1d4ed8",
    height: "5px",
    startOnLoad: true,
    spinnerPosition: isArabic ? "top-left" : "top-right",
    options: {
      direction: isArabic ? "rtl" : "ltr",
      showSpinner: isDesktop,
    },
  };

  const toasterOptions: ToasterProps = {
    position: isArabic ? "bottom-left" : "bottom-right",
    theme: "dark",
    toastOptions: {
      classNames: {
        error: "!border !border-red-500 !text-red-500",
        success: "!border !border-green-500 !text-green-500",
      },
    },
  };

  return (
    <Provider store={store}>
      <ProgressProvider {...progressProviderOptions}>
        <NoInternetToast />
        <Toaster {...toasterOptions} />
        <RouteTracker />
        <LibraryInit isArabic={isArabic} />
        <BackToTop />
        <ImgModal />
        <VideoModal />
        <Navbar isDesktop={isDesktop} />
        <div className="min-h-screen">{children}</div>
      </ProgressProvider>
    </Provider>
  );
};

export default App;
