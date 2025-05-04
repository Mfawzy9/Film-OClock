"use client";
import Card from "@/app/_Components/Card/Card";
import MainLoader from "@/app/_Components/MainLoader/MainLoader";
import PageSection from "@/app/_Components/PageSection/PageSection";
import Pagination from "@/app/_Components/Pagination/Pagination";
import Title from "@/app/_Components/Title/Title";
import { PplTrendsResponse } from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import { useRouter } from "@/i18n/navigation";
import { useGetTrendsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const baseImgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL_W500;

const TrendingPpl = () => {
  const t = useTranslations("Trending");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page"));
  const [page, setPage] = useState(pageParam || 1);
  const [dayOrWeek, setDayOrWeek] = useState<"day" | "week">("day");
  const { data, isLoading, isError, isFetching } = useGetTrendsQuery({
    showType: "person",
    dayOrWeek,
    page,
  });

  const trendingPpl = data as PplTrendsResponse;

  const tabs = useMemo(
    (): { query: "day" | "week"; title: string }[] => [
      { query: "day", title: t("Today") },
      { query: "week", title: t("ThisWeek") },
    ],
    [t],
  );

  const handleWeekOrDay = (id: "day" | "week") => {
    setPage(1);
    router.push(`?page=${1}`, { scroll: false });
    setDayOrWeek(id);
  };

  if (isLoading) {
    return <MainLoader />;
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <PageSection>
      <div className="flex flex-col gap-2 sm:gap-0 sm:flex-row items-center justify-between">
        {/* titel */}
        <div className="mb-3 sm:mb-0">
          <Title title={t("PeopleTitle")} />
          <p className="text-gray-400">
            {dayOrWeek === "day"
              ? t("TodayDescPeople")
              : t("ThisWeekDescPeople")}
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
        className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2
          xs:gap-4 place-items-center"
      >
        {trendingPpl?.results.map((person, idx) => {
          if (!person.profile_path) return null;
          return (
            <motion.div key={person.id} layout>
              <Card
                name={person.name}
                id={person.id}
                src={baseImgUrl + person.profile_path}
                showType="person"
                rating={person.popularity}
                personJob={person.known_for_department}
                alt={person.name}
                idx={idx}
              />
            </motion.div>
          );
        })}
      </main>

      {trendingPpl?.total_pages > 1 && (
        <Pagination
          isLoading={isLoading}
          isFetching={isFetching}
          currentPage={page}
          setPage={setPage}
          totalPages={trendingPpl?.total_pages}
        />
      )}
    </PageSection>
  );
};

export default TrendingPpl;
