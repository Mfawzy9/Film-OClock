"use client";
import MainLoader from "@/app/_Components/MainLoader/MainLoader";
import PageSection from "@/app/_Components/PageSection/PageSection";
import { PopularPersonI } from "@/app/interfaces/apiInterfaces/popularMoviesTvInterfaces";
import { useGetPopularQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { useCallback, useEffect, useMemo, useState } from "react";
import CastCardSlider from "@/app/_Components/CastCardSlider/CastCardSlider";
import Card from "@/app/_Components/Card/Card";
import Title from "@/app/_Components/Title/Title";
import { SiSpinrilla } from "react-icons/si";
import { useTranslations } from "next-intl";
import TopOneCard from "./TopOneCard";

const baseImgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL_W500;

const PopularPpl = () => {
  const t = useTranslations("PopularPeople");
  const [page, setPage] = useState(1);
  const [topOneId, setTopOneId] = useState<number | null>(null);
  const [allData, setAllData] = useState<PopularPersonI[]>([]);
  const [featuredCast, setFeaturedCast] = useState<PopularPersonI[]>([]);

  // get popular
  const { data, isLoading, isFetching } = useGetPopularQuery({
    showType: "person",
    page,
  });

  const popular = useMemo(() => data?.results as PopularPersonI[], [data]);

  // Compute featured cast once
  const filteredCast = useMemo(() => {
    return popular
      ?.filter((person) => person.known_for_department === "Acting")
      .slice(1, 11);
  }, [popular]);

  // get top one and featured cast only from the first page
  useEffect(() => {
    if (popular && page === 1) {
      // Find the first person with a profile_path
      const topOne = popular.find((person) => person.profile_path);
      if (topOne && !topOneId) {
        setTopOneId(topOne.id);
      }

      if (featuredCast.length === 0) {
        setFeaturedCast(filteredCast);
      }
    }
  }, [popular, page, filteredCast, topOneId, featuredCast.length]);

  // Append new results while avoiding duplicates
  useEffect(() => {
    if (popular) {
      setAllData((prev) => {
        const seenIds = new Set(prev.map((p) => p.id)); // Track seen IDs
        const newResults = popular.filter((p) => !seenIds.has(p.id)); // Filter out duplicates
        return [...prev, ...newResults]; // Append new data
      });
    }
  }, [popular]);

  const handleLoadMore = useCallback(() => {
    if (!isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching]);

  if (isLoading) return <MainLoader />;

  return (
    <>
      <PageSection>
        <section className="flex flex-col gap-28">
          {/* top one */}
          {topOneId && <TopOneCard topOneId={topOneId} />}

          {/* Featured Cast */}
          <CastCardSlider featuredCast={featuredCast} />

          {/* all cast */}
          <main>
            <div
              className="italic animate-pulse mb-10 mx-auto lg:mx-0 w-fit relative after:content-['']
                after:animate-bounce after:absolute after:-bottom-3 after:left-0 after:w-14
                lg:after:h-1 after:bg-blue-800"
            >
              <Title title={t("AllStars")} />
            </div>
            <div
              className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6
                xl:grid-cols-8 gap-2 xs:gap-4 place-items-center"
            >
              {allData?.map((person, idx) => {
                if (!person.profile_path) return null;
                return (
                  <div key={person.id} className="">
                    <Card
                      idx={idx}
                      personJob={person.known_for_department}
                      alt={person.name}
                      id={person.id}
                      name={person.name}
                      src={`${baseImgUrl}${person.profile_path}`}
                      showType="person"
                      rating={person.popularity}
                      ImgContainerHeight="min-h-56"
                    />
                  </div>
                );
              })}
            </div>
          </main>
        </section>

        {/* load more */}
        {page === 500
          ? null
          : data?.total_pages &&
            page < data.total_pages && (
              <button
                disabled={isFetching || isLoading}
                onClick={handleLoadMore}
                className="bg-blue-800 text-white text-lg font-semibold px-4 py-2 rounded-md mt-5
                  text-center mx-auto hover:bg-blue-950 transition-colors duration-200
                  disabled:cursor-not-allowed disabled:bg-gray-600 w-full flex items-center
                  justify-center gap-2"
              >
                {isFetching || isLoading ? (
                  <span className="flex items-center gap-2">
                    <SiSpinrilla className="animate-spin text-2xl" />
                    {t("Loading")}
                  </span>
                ) : (
                  t("LoadMore")
                )}
              </button>
            )}
      </PageSection>
    </>
  );
};

export default PopularPpl;
