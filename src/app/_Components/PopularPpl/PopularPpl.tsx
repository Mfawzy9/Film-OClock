"use client";
import PageSection from "@/app/_Components/PageSection/PageSection";
import { PopularPersonI } from "@/app/interfaces/apiInterfaces/popularMoviesTvInterfaces";
import { useGetPopularQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import LazyRender from "../LazyRender/LazyRender";
import { useProgress } from "@bprogress/next";
import { useTranslations } from "next-intl";

const TopOneCard = dynamic(() => import("../TopOneCard/TopOneCard"));
const CardsSkeletons = dynamic(() => import("../Card/CardsSkeletons"));
const FeaturedCastCardsSkeletonSlider = dynamic(
  () => import("../FeaturedCastCardSlider/FeaturedCastCardsSkeletonSlider"),
);
const TopOneCardSkeleton = dynamic(
  () => import("../TopOneCard/TopOneCardSkeleton"),
);
const FeaturedCastCardsSlider = dynamic(
  () =>
    import("@/app/_Components/FeaturedCastCardSlider/FeaturedCastCardsSlider"),
);
const AllPpl = dynamic(() => import("./AllPpl"));

const PopularPpl = () => {
  const t = useTranslations("PopularPeople");
  const [page, setPage] = useState(1);
  const [topOneId, setTopOneId] = useState<number | null>(null);
  const [allData, setAllData] = useState<PopularPersonI[]>([]);
  const [featuredCast, setFeaturedCast] = useState<PopularPersonI[]>([]);
  const { start, stop } = useProgress();

  // get popular
  const { data, isLoading, isFetching, isSuccess, isError } =
    useGetPopularQuery({
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

  useEffect(() => {
    if (isLoading) {
      start(0, 0, true);
    } else if (isSuccess || isError) {
      stop();
    }
  }, [isLoading, isSuccess, isError, start, stop]);

  if (
    isLoading ||
    isError ||
    !popular ||
    !data ||
    !allData ||
    !featuredCast ||
    !topOneId
  ) {
    return (
      <PageSection>
        <TopOneCardSkeleton />
      </PageSection>
    );
  }

  return (
    <>
      <PageSection>
        <section className="flex flex-col gap-28">
          {/* top one */}
          {topOneId && <TopOneCard topOneId={topOneId} />}

          {/* Featured Cast */}
          <LazyRender
            persistKey="featuredCast"
            Component={FeaturedCastCardsSlider}
            props={{ featuredCast, isLoading }}
            loading={<FeaturedCastCardsSkeletonSlider />}
          />
        </section>

        <LazyRender
          persistKey="allPpl"
          Component={AllPpl}
          props={{
            allData,
            data,
            isFetching,
            isLoading,
            page,
            setPage,
            t,
          }}
          loading={
            <CardsSkeletons
              title={t("AllStars")}
              gridColsClasses="grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6
                xl:grid-cols-8 gap-2 xs:gap-4"
              posterHeight="h-[230px]"
            />
          }
        />
      </PageSection>
    </>
  );
};

export default PopularPpl;
