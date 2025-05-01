"use client";
import { useTranslations } from "next-intl";
import "./MainLoader.css";

const MainLoader = () => {
  const t = useTranslations("Loader");
  return (
    <div
      className="flex justify-center items-center h-screen w-screen fixed inset-0 z-[1000]
        bg-black"
    >
      <div className="pl bg-gray-950 shadow-blueGlow">
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__dot" />
        <div className="pl__text">{t("Loading")}</div>
      </div>
    </div>
  );
};

export default MainLoader;
