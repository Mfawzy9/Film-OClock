"use client";
import "./globals.css";
import store from "@/lib/Redux/store";
import { Provider } from "react-redux";
import Navbar from "../_Components/Navbar/Navbar";
import VideoModal from "../_Components/VideoModal/VideoModal";
import ImgModal from "../_Components/ImgModal/ImgModal";
import Footer from "../_Components/Footer/Footer";
import { useEffect } from "react";
import { listenToAuthChanges } from "@/lib/firebase/authService";
import BackToTop from "../_Components/BackToTop/BackToTop";
import LibraryInit from "../_Components/Library/LibraryInit/LibraryInit";
import RouteTracker from "../_Components/RouteTracker/RouteTracker";
import { ProgressProvider } from "@bprogress/next/app";
import useIsDesktop from "../hooks/useIsDesktop";

const App = ({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: "en" | "ar";
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
  return (
    <Provider store={store}>
      <ProgressProvider
        color="#1d4ed8"
        height={"5px"}
        startOnLoad
        spinnerPosition={locale === "ar" ? "top-left" : "top-right"}
        options={{
          direction: locale === "ar" ? "rtl" : "ltr",
          showSpinner: isDesktop,
        }}
      >
        <RouteTracker />
        <LibraryInit locale={locale} />
        <BackToTop />
        <ImgModal />
        <VideoModal />
        <Navbar isDesktop={isDesktop} />
        <div className="min-h-screen">{children}</div>
        <Footer />
      </ProgressProvider>
    </Provider>
  );
};

export default App;
