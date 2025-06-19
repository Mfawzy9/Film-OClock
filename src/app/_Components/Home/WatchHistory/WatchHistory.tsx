"use client";
import PageSection from "../../PageSection/PageSection";
import Title from "../../Title/Title";
import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import { WatchHistoryItem } from "@/app/interfaces/localInterfaces/watchHistoryInterfaces";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import LazyRender from "../../LazyRender/LazyRender";
import WatchHistoryCard from "./WatchHistoryCard";
import { motion } from "framer-motion";

const WatchHistorySkeleton = dynamic(() => import("./WatchHistorySkeleton"));

const WatchHistory = () => {
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const t = useTranslations("HomePage");
  const [historyLength, setHistoryLength] = useState(1);

  const loadHistory = () => {
    try {
      const storedHistory = localStorage.getItem("WatchedHistory");
      if (!storedHistory) return;

      const parsedHistory = JSON.parse(storedHistory);
      const historyArray = Object.values(parsedHistory) as WatchHistoryItem[];

      setHistoryLength(historyArray.length);

      const sortedHistory = historyArray.sort(
        (a, b) =>
          new Date(b.watchedAt + " " + b.watchedTime).getTime() -
          new Date(a.watchedAt + " " + a.watchedTime).getTime(),
      );

      setWatchHistory(sortedHistory);
    } catch (error) {
      console.error("Failed to load watch history:", error);
      toast.error("Failed to load watch history");
      setWatchHistory([]);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    loadHistory();

    window.addEventListener("storage", loadHistory);
    return () => window.removeEventListener("storage", loadHistory);
  }, []);

  const deleteHistoryItem = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const storedHistory = localStorage.getItem("WatchedHistory");
    if (!storedHistory) return;

    const parsedHistory = JSON.parse(storedHistory);
    delete parsedHistory[id];
    localStorage.setItem("WatchedHistory", JSON.stringify(parsedHistory));

    setWatchHistory((prevHistory) =>
      prevHistory.filter((item) => item.id !== id),
    );

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent("watch-history-updated"));
  };

  if (watchHistory.length === 0) return null;

  return (
    <LazyRender
      persistKey="WatchHistory-home"
      props={{ watchHistory, deleteHistoryItem, t }}
      Component={WatchHistorySection}
      loading={<WatchHistorySkeleton length={historyLength} />}
      rootMargin="0px 0px"
    />
  );
};

export default memo(WatchHistory);

const WatchHistorySection = ({
  watchHistory,
  deleteHistoryItem,
  t,
}: {
  watchHistory: WatchHistoryItem[];
  deleteHistoryItem: (e: React.MouseEvent, id: number) => void;
  t: any;
}) => (
  <PageSection className="!pt-10 !pb-3">
    <Title title={t("WatchHistorySliderTitle")} />
    <div
      className={`flex gap-4 flex-nowrap overflow-x-auto py-2 px-1 ${
        watchHistory.length > 5 ? " pb-3" : "" }`}
    >
      {watchHistory?.map((show) => {
        return (
          <motion.div key={`watch-history-${show.id}`} layout>
            <WatchHistoryCard
              show={show}
              t={t}
              deleteHistoryItem={deleteHistoryItem}
            />
          </motion.div>
        );
      })}
    </div>
  </PageSection>
);
