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

const App = ({ children }: { children: React.ReactNode }) => {
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
      <RouteTracker />
      <LibraryInit />
      <BackToTop />
      <ImgModal />
      <VideoModal />
      <Navbar />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </Provider>
  );
};

export default App;
