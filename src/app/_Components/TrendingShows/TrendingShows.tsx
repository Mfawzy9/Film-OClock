"use client";
import Card from "@/app/_Components/Card/Card";
import PageSection from "@/app/_Components/PageSection/PageSection";
import Pagination from "@/app/_Components/Pagination/Pagination";
import Title from "@/app/_Components/Title/Title";
import {
  MoviesTrendsResponse,
  TVShowsTrendsResponse,
} from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import { useGetTrendsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import CardsSkeletons from "../Card/CardsSkeletons";
import { useRouter } from "@/i18n/navigation";

const baseImgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL_W500;

type TrendingShowsProps = {
  showType: "movie" | "tv";
};

const TrendingShows = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page"));
  const { showType } = useParams<TrendingShowsProps>();

  const t = useTranslations("Trending");

  const tabs = useMemo(
    (): { query: "day" | "week"; title: string }[] => [
      { query: "day", title: t("Today") },
      { query: "week", title: t("ThisWeek") },
    ],
    [t],
  );

  const [page, setPage] = useState(pageParam || 1);
  const [dayOrWeek, setDayOrWeek] = useState<"day" | "week">("day");

  const { data, isLoading, isError, isFetching } = useGetTrendsQuery({
    showType,
    dayOrWeek,
    page,
  });

  const trendingData = data as MoviesTrendsResponse | TVShowsTrendsResponse;

  const handleWeekOrDay = (query: "day" | "week") => {
    setPage(1);
    router.push(`?page=${1}`, { scroll: false });
    setDayOrWeek(query);
  };

  if (isLoading) return <CardsSkeletons title={t("MoviesTitle")} />;
  if (isError) return <div>Error loading data</div>;

  const title = showType === "movie" ? t("MoviesTitle") : t("TvShowsTitle");

  return (
    <>
      <PageSection>
        <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row items-center justify-between">
          <div className="mb-3 sm:mb-0">
            <Title title={title} />
            <p className="text-gray-400">
              {dayOrWeek === "day" ? t("TodayDesc") : t("ThisWeekDesc")}
            </p>
          </div>
          <div className="flex gap-2 rounded-full bg-black shadow-blueGlow overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.query}
                className="relative px-4 py-2 rounded-full hover:bg-gray-900 transition-colors duration-200"
                onClick={() => handleWeekOrDay(tab.query)}
              >
                {dayOrWeek === tab.query && (
                  <motion.span
                    initial={false}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    layoutId="trendingTabs"
                    className="absolute inset-0 bg-blue-900 rounded-full"
                  />
                )}
                <span className="relative z-10">{tab.title}</span>
              </button>
            ))}
          </div>
        </div>

        <main
          className="mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4
            lg:grid-cols-5 gap-4 place-items-center"
        >
          {trendingData?.results.map((item, idx) => {
            const name =
              "title" in item ? item.original_title : item.original_name;
            const releaseDate =
              "release_date" in item ? item.release_date : item.first_air_date;

            return (
              <motion.div key={item.id} layout>
                <Card
                  theShow={item}
                  idx={idx}
                  name={name}
                  id={item.id}
                  src={baseImgUrl + item.poster_path}
                  showType={showType}
                  rating={item.vote_average}
                  release_date={releaseDate}
                  alt={name}
                />
              </motion.div>
            );
          })}
        </main>

        {trendingData?.total_pages > 1 && (
          <Pagination
            isLoading={isLoading}
            isFetching={isFetching}
            currentPage={page}
            setPage={setPage}
            totalPages={trendingData?.total_pages}
          />
        )}
      </PageSection>
    </>
  );
};

export default TrendingShows;
