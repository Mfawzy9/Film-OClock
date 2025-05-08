"use client";

import Card from "@/app/_Components/Card/Card";
import PageSection from "@/app/_Components/PageSection/PageSection";
import Pagination from "@/app/_Components/Pagination/Pagination";
import Title from "@/app/_Components/Title/Title";
import { useGetPopularQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import CardsSkeletons from "../Card/CardsSkeletons";

const baseImgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL_W500;

const PopularShows = () => {
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page"));
  const t = useTranslations("Popular");
  const { showType } = useParams<{ showType: "movie" | "tv" }>();

  const [page, setPage] = useState(pageParam || 1);

  const { data, isLoading, isFetching } = useGetPopularQuery({
    page,
    showType,
  });

  const title = showType === "movie" ? t("PopularMovies") : t("PopularTvShows");

  if (isLoading) return <CardsSkeletons title={title} />;

  return (
    <>
      <PageSection>
        <Title title={title} />
        <main
          className="mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4
            lg:grid-cols-5 gap-4 place-items-center min-h-screen relative"
        >
          {data?.results?.map((show: any, idx: number) => {
            if (!show.poster_path) return null;
            const name =
              showType === "movie"
                ? (show.title ?? show.original_title)
                : (show.name ?? show.original_name);
            const releaseDate =
              showType === "movie" ? show.release_date : show.first_air_date;

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

        {data?.total_pages && data.total_pages > 1 && (
          <Pagination
            isLoading={isLoading}
            isFetching={isFetching}
            currentPage={page}
            totalPages={data.total_pages}
            setPage={setPage}
          />
        )}
      </PageSection>
    </>
  );
};

export default PopularShows;
