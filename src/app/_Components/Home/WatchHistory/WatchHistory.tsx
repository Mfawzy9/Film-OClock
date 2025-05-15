"use client";
import Image from "next/image";
import PageSection from "../../PageSection/PageSection";
import Title from "../../Title/Title";
import { memo, useEffect, useState } from "react";
import {
  minutesToHMS,
  minutesToHours,
  nameToSlug,
  secondsToHMS,
} from "../../../../../helpers/helpers";
import { Link } from "@/i18n/navigation";
import { motion } from "motion/react";
import { toast } from "sonner";
import { WatchHistoryItem } from "@/app/interfaces/localInterfaces/watchHistoryInterfaces";
import { useTranslations } from "next-intl";
import useIsArabic from "@/app/hooks/useIsArabic";
import { IoMdCloseCircle } from "@react-icons/all-files/io/IoMdCloseCircle";

const WatchHistory = () => {
  const { isArabic } = useIsArabic();
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>([]);
  const t = useTranslations("HomePage");

  const loadHistory = () => {
    try {
      const storedHistory = localStorage.getItem("WatchedHistory");
      if (!storedHistory) return;

      const parsedHistory = JSON.parse(storedHistory);

      // Convert object of objects to array
      const historyArray = Object.values(parsedHistory) as WatchHistoryItem[];

      // Sort by most recently watched
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

  const hrefLink = ({ show }: { show: WatchHistoryItem }) => {
    if (show.showType === "tv") {
      return `/watch/tv/${show.id}/${nameToSlug(show?.title)}?season=${show.season}&episode=${show.episode}`;
    } else {
      return `/watch/movie/${show.id}/${nameToSlug(show?.title)}`;
    }
  };

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
    <PageSection className="!pt-10 !pb-3">
      <Title title={t("WatchHistorySliderTitle")} />
      <div
        className={`flex gap-4 flex-nowrap overflow-x-auto custom-scrollbar py-2 px-1 ${
          watchHistory.length > 5 ? " pb-3" : "" }`}
      >
        {watchHistory?.map((show) => {
          return (
            <motion.div
              key={`show.id-${show.id}`}
              className="relative w-52 flex-none bg-gray-900 rounded-md border border-gray-700
                lg:hover:shadow-blueGlow lg:hover:shadow-blue-700/70"
              layout
            >
              {/* delete button */}
              <button
                onClick={(e) => deleteHistoryItem(e, show.id)}
                className="absolute top-0 right-0 z-20 text-white bg-black rounded-full text-2xl
                  hover:text-blue-500"
              >
                <IoMdCloseCircle />
              </button>
              <Link href={hrefLink({ show })} className="relative">
                {/* bg */}
                <div className="relative rounded-md overflow-hidden">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W200}${show.backdropPath}`}
                    width={208}
                    height={130}
                    alt="bg"
                  />
                  {/* layer */}
                  <div
                    className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80
                      via-transparent to-black/80"
                  />
                  {/* title */}
                  <h2 className="absolute z-10 font-bold bottom-0 left-2 line-clamp-1">
                    {show.title}
                  </h2>
                  {/* episode & season */}
                  {show.season && show.episode && (
                    <span className="absolute z-10 top-1 left-1 text-gray-300 bg-black/50 px-1 rounded-lg text-sm">
                      {t("WatchHistorySliderSeason")}
                      {show.season}
                      {t("WatchHistorySliderEpisode")}
                      {show.episode}
                    </span>
                  )}
                </div>
                {/* details */}
                <div className="flex flex-col mt-2 gap-1.5 px-2 pb-1">
                  {/* progress bar */}
                  <div className="bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-52">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${show.progress.percentage}%` }}
                    />
                  </div>
                  {/* start time & end time */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      {secondsToHMS(show?.progress?.watched)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {secondsToHMS(show?.progress?.duration) === "00:00:00"
                        ? minutesToHMS(
                            (show.movieRuntime ?? 0) ||
                              (show.episodeRuntime ?? 0),
                          )
                        : secondsToHMS(show?.progress?.duration)}
                    </span>
                  </div>
                  {/* time */}
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>
                      {minutesToHours(
                        (show.movieRuntime ?? 0) || (show.episodeRuntime ?? 0),
                        isArabic,
                      )}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
        {/* history card */}
      </div>
    </PageSection>
  );
};

export default memo(WatchHistory);
