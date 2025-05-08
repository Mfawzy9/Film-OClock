"use client";
import Card from "@/app/_Components/Card/Card";
import PageSection from "@/app/_Components/PageSection/PageSection";
import Pagination from "@/app/_Components/Pagination/Pagination";
import Title from "@/app/_Components/Title/Title";
import { useGetNowPlayingQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { useTranslations } from "next-intl";
import { useState } from "react";
import CardsSkeletons from "../Card/CardsSkeletons";
import { useSearchParams } from "next/navigation";

const baseImgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL_W500;
const NowPlayingMovies = () => {
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page"));
  const t = useTranslations("NowPlayingMovies");
  const [page, setPage] = useState(pageParam || 1);
  const {
    data: nowPlayingMovies,
    isLoading,
    isFetching,
  } = useGetNowPlayingQuery({ page });

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
          {nowPlayingMovies?.results.map((movie, idx) => {
            if (!movie.poster_path) return null;
            return (
              <Card
                theShow={movie}
                key={movie.id}
                alt={movie.title || movie.original_title}
                id={movie.id}
                name={movie.title || movie.original_title}
                src={baseImgUrl + movie.poster_path}
                rating={movie.vote_average}
                release_date={movie.release_date}
                showType="movie"
                idx={idx}
              />
            );
          })}
        </main>

        {/* pagination */}
        {nowPlayingMovies?.total_pages && nowPlayingMovies?.total_pages > 1 && (
          <Pagination
            isFetching={isFetching}
            isLoading={isLoading}
            currentPage={page}
            totalPages={nowPlayingMovies.total_pages ?? 1}
            setPage={setPage}
          />
        )}
      </PageSection>
    </>
  );
};

export default NowPlayingMovies;
