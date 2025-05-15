"use client";
import Card from "@/app/_Components/Card/Card";
import PageSection from "@/app/_Components/PageSection/PageSection";
import Pagination from "@/app/_Components/Pagination/Pagination";
import Title from "@/app/_Components/Title/Title";
import { useGetOnTheAirQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

const CardsSkeletons = dynamic(() => import("../Card/CardsSkeletons"));

const baseImgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL_W500;

const OnTheAir = () => {
  const t = useTranslations("OnTheAirTvShows");
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page"));
  const [page, setPage] = useState(pageParam || 1);
  const {
    data: onTheAirTvShows,
    isLoading,
    isFetching,
  } = useGetOnTheAirQuery({ page });

  if (isLoading) return <CardsSkeletons title={t("title")} />;
  return (
    <>
      <PageSection>
        {/* title */}
        <Title title={t("title")} />
        <main
          className="mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4
            lg:grid-cols-5 gap-4 place-items-center min-h-screen relative"
        >
          {/* cards */}
          {onTheAirTvShows?.results.map((tvShow, idx) => {
            if (!tvShow.poster_path) return null;
            return (
              <Card
                theShow={tvShow}
                key={tvShow.id}
                alt={tvShow.name || tvShow.original_name}
                id={tvShow.id}
                name={tvShow.name || tvShow.original_name}
                src={baseImgUrl + tvShow.poster_path}
                rating={tvShow.vote_average}
                release_date={tvShow.first_air_date}
                showType="tv"
                idx={idx}
              />
            );
          })}
        </main>

        {/* pagination */}
        {onTheAirTvShows?.total_pages && onTheAirTvShows?.total_pages > 1 && (
          <Pagination
            isFetching={isFetching}
            isLoading={isLoading}
            currentPage={page}
            totalPages={onTheAirTvShows.total_pages ?? 1}
            setPage={setPage}
          />
        )}
      </PageSection>
    </>
  );
};

export default OnTheAir;
