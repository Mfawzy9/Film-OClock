"use client";

import useWatchedList from "@/app/hooks/useWatchedList";
import PageSection from "../PageSection/PageSection";
import Card from "../Card/Card";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { useGetWatchedQuery } from "@/lib/Redux/apiSlices/firestoreSlice";
import { useEffect, useMemo, useState } from "react";
import { setWatchedShows } from "@/lib/Redux/localSlices/librarySlice";
import MainLoader from "../MainLoader/MainLoader";
import Title from "../Title/Title";
import PageHeader from "../PageHeader/PageHeader";
import EmptyWatchedShows from "./EmptyWatchedShows";
import LibSearch from "../Library/LibSearch/LibSearch";
import { FaTimes } from "@react-icons/all-files/fa/FaTimes";

const WatchedShows = () => {
  const dispatch = useDispatch();
  const t = useTranslations("Library.WatchedList");
  const { handleClick, watchedShows, isLoading, user } = useWatchedList({});

  // get watched shows
  const {
    data: watchdShowsData,
    isLoading: watchedShowsLoading,
    isFetching: watchedShowsFetching,
  } = useGetWatchedQuery({ userId: user?.uid || "" }, { skip: !user?.uid });

  useEffect(() => {
    if (watchdShowsData) {
      dispatch(setWatchedShows(watchdShowsData));
    }
  }, [dispatch, watchdShowsData]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredWatchedShows = useMemo(() => {
    if (!searchTerm) return watchedShows;

    const lowerSearch = searchTerm.toLowerCase();

    return watchedShows.filter((show) =>
      show.title.toLowerCase().includes(lowerSearch),
    );
  }, [watchedShows, searchTerm]);

  if (watchedShowsLoading || !user) {
    return <MainLoader />;
  }

  return (
    <>
      <PageHeader />
      {watchedShows?.length === 0 ? (
        <EmptyWatchedShows />
      ) : (
        <PageSection>
          <div
            className="italic animate-pulse w-fit relative after:content-[''] after:animate-bounce
              after:absolute after:-bottom-1 after:start-0 after:w-14 lg:after:h-1
              after:bg-blue-800 mb-8"
          >
            <Title title={`${t("title")} (${watchedShows?.length})`} />
          </div>
          {watchedShows?.length > 5 && (
            <LibSearch
              setSearchTerm={setSearchTerm}
              searchTerm={searchTerm}
              libraryWord="WatchedList"
            />
          )}

          <main
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
              gap-4 place-items-center"
          >
            {filteredWatchedShows?.map((show, idx) => {
              const amOrPm = show.watchedAtTime?.includes("AM")
                ? t("AM")
                : t("PM");
              return (
                <motion.div
                  key={`watched-${show.id}`}
                  layout
                  className={`flex flex-col gap-1 border border-gray-800 p-1 rounded-md relative ${ (isLoading
                    || watchedShowsFetching) && "pointer-events-none opacity-50 animate-pulse" }`}
                >
                  <button
                    className="absolute -top-3 -end-3 text-lg bg-red-600 hover:bg-red-800 rounded-full p-0.5"
                    onClick={() =>
                      handleClick({
                        showId: Number(show.id),
                        showName: show.title,
                        theShow: show,
                      })
                    }
                  >
                    <FaTimes />
                  </button>
                  <div className="flex justify-between text-gray-300">
                    <h6>{show.watchedAtDate}</h6>
                    <h6>
                      {show.watchedAtTime?.split(":").slice(0, 2).join(":")}{" "}
                      {amOrPm}
                    </h6>
                  </div>
                  <Card
                    theShow={show}
                    alt={show.title}
                    id={show.id}
                    idx={idx}
                    name={show.title}
                    rating={show.rating}
                    showType={show.showType}
                    src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${show.posterPath}`}
                    release_date={show.releaseDate}
                  />
                </motion.div>
              );
            })}
          </main>
        </PageSection>
      )}
    </>
  );
};

export default WatchedShows;
