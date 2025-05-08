"use client";

import { useState } from "react";
import Card from "@/app/_Components/Card/Card";
import PageSection from "@/app/_Components/PageSection/PageSection";
import Pagination from "@/app/_Components/Pagination/Pagination";
import Title from "@/app/_Components/Title/Title";
import { useGetTopRatedQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import {
  TopRatedMovieI,
  TopRatedTvShowI,
} from "@/app/interfaces/apiInterfaces/topRatedInterfaces";
import { useParams, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import CardsSkeletons from "../Card/CardsSkeletons";

const baseImgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL_W500;

type ShowType = "movie" | "tv";

const DynamicTopRatedShows = () => {
  const { showType } = useParams<{ showType: ShowType }>();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page"));
  const t = useTranslations("TopRated");
  const [page, setPage] = useState(pageParam || 1);
  const { data, isLoading, isFetching } = useGetTopRatedQuery({
    page,
    showType,
  });

  const title =
    showType === "movie" ? t("TopRatedMovies") : t("TopRatedTvShows");

  if (isLoading) return <CardsSkeletons title={title} />;

  const shows: TopRatedMovieI[] | TopRatedTvShowI[] = data?.results ?? [];
  const totalPages = data?.total_pages ?? 1;

  return (
    <>
      <PageSection>
        {/* Title */}
        <Title title={title} />

        {/* Cards */}
        <main
          className="mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4
            lg:grid-cols-5 gap-4 place-items-center min-h-screen relative"
        >
          {shows.map((show, idx: number) => {
            if (!show.poster_path) return null;

            const name =
              "title" in show
                ? (show.title ?? show.original_title)
                : (show.name ?? show.original_name);

            const releaseDate =
              "title" in show ? show.release_date : show.first_air_date;

            return (
              <Card
                theShow={show}
                key={show.id}
                alt={name}
                id={show.id}
                name={name}
                src={baseImgUrl + show.poster_path}
                rating={show.vote_average}
                release_date={releaseDate}
                showType={showType}
                idx={idx}
              />
            );
          })}
        </main>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            isLoading={isLoading}
            isFetching={isFetching}
            currentPage={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        )}
      </PageSection>
    </>
  );
};

export default DynamicTopRatedShows;
