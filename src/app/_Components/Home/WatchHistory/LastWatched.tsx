"use client";

import { useEffect, useState } from "react";
import PageSection from "../../PageSection/PageSection";
import ShortDetails from "../../ShortDetails/ShortDetails";
import Title from "../../Title/Title";
import { WatchHistoryItem } from "@/app/interfaces/localInterfaces/watchHistoryInterfaces";
import { useTranslations } from "next-intl";

const LastWatched = () => {
  const [lastWatched, setLastWatched] = useState<WatchHistoryItem | null>(null);
  const t = useTranslations("HomePage");

  const loadLastWatched = () => {
    if (typeof window === "undefined") return;

    const storedHistory = localStorage.getItem("WatchedHistory");
    if (!storedHistory) {
      setLastWatched(null);
      return;
    }

    try {
      const watchedShows = JSON.parse(storedHistory);
      const lastWatchedArray = Object.values(
        watchedShows,
      ) as WatchHistoryItem[];

      if (lastWatchedArray.length === 0) {
        setLastWatched(null);
        return;
      }

      const lastWatchedByDate = lastWatchedArray.sort(
        (a, b) =>
          new Date(b.watchedAt + " " + b.watchedTime).getTime() -
          new Date(a.watchedAt + " " + a.watchedTime).getTime(),
      );

      setLastWatched(lastWatchedByDate[0]);
    } catch (error) {
      console.error("Error parsing watch history:", error);
      setLastWatched(null);
    }
  };

  useEffect(() => {
    loadLastWatched();

    // Listen for both storage changes and custom events
    const handleUpdate = () => loadLastWatched();

    window.addEventListener("storage", handleUpdate);
    window.addEventListener("watch-history-updated", handleUpdate);

    return () => {
      window.removeEventListener("storage", handleUpdate);
      window.removeEventListener("watch-history-updated", handleUpdate);
    };
  }, []);

  if (!lastWatched) return null;

  return (
    <PageSection className="!py-0 mt-14">
      <Title title={t("LastWatchedTitle")} />
      <ShortDetails
        theShow={lastWatched}
        backdropPath={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_ORI}${lastWatched.backdropPath}`}
        showType={lastWatched.showType}
        showId={lastWatched.id}
        scroll={false}
        description={
          lastWatched.episodeOverview
            ? lastWatched.episodeOverview
            : lastWatched.overview
        }
        rating={lastWatched.rating}
        releaseDate={lastWatched.releaseDate}
        title={lastWatched.title}
        genresIds={lastWatched.genresIds}
        episode={lastWatched.episode}
        season={lastWatched.season}
      />
    </PageSection>
  );
};

export default LastWatched;
