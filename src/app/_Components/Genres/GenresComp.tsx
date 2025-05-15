"use client";
import { useCallback, useMemo, useState } from "react";
import { motion } from "motion/react";
import { SiSpinrilla } from "react-icons/si";
import Card from "@/app/_Components/Card/Card";
import PageSection from "@/app/_Components/PageSection/PageSection";
import Pagination from "@/app/_Components/Pagination/Pagination";
import Title from "@/app/_Components/Title/Title";
import {
  useGetGenresQuery,
  useGetMoviesTvShowsQuery,
} from "@/lib/Redux/apiSlices/tmdbSlice";
import { useParams, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import CardsSkeletons from "../Card/CardsSkeletons";
import {
  MoviesResponse,
  TVShowsResponse,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";

const baseImgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL_W500;

const GenresComp = () => {
  const locale = useLocale();
  const { showType } = useParams() as { showType: "movie" | "tv" };
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page"));
  const t = useTranslations("ExploreByGenres");
  const defaultGenre = showType === "movie" ? "28" : "10759";
  const [page, setPage] = useState(pageParam || 1);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    defaultGenre,
  ]);

  const selectedGenresSet = useMemo(
    () => new Set(selectedGenres),
    [selectedGenres],
  );

  const {
    data,
    isLoading: isLoadingContent,
    isFetching: isFetchingContent,
  } = useGetMoviesTvShowsQuery({
    genreNum: selectedGenres,
    showType,
    page,
  });

  const {
    data: genres,
    isLoading: isLoadingGenres,
    isFetching: isFetchingGenres,
  } = useGetGenresQuery(
    { showType, lang: locale },
    {
      refetchOnMountOrArgChange: false,
      refetchOnReconnect: false,
    },
  );

  const content = data as MoviesResponse | TVShowsResponse;
  const isLoading = isLoadingContent || isLoadingGenres;
  const isFetching = isFetchingContent || isFetchingGenres;

  const handleGenreClick = useCallback((genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
    setPage(1);
  }, []);

  const renderGenreButton = useCallback(
    (genre: { id: number; name: string }) => (
      <button
        key={genre.id}
        className={`${
          selectedGenresSet.has(String(genre.id))
            ? "bg-blue-700 hover:bg-blue-800"
            : "bg-gray-800 hover:bg-gray-900"
          } px-3 py-1 rounded-lg transition-colors duration-200`}
        onClick={() => handleGenreClick(String(genre.id))}
      >
        {genre.name}
      </button>
    ),
    [selectedGenresSet, handleGenreClick],
  );

  if (isLoading)
    return (
      <PageSection>
        <Title title={t("title")} />

        <div className="flex flex-wrap gap-2">
          {[...Array(19)].map((_, i) => (
            <div
              key={i}
              className="px-3 py-1 rounded-lg bg-gray-800 animate-pulse h-8"
              style={{
                width: `${Math.floor(Math.random() * (120 - 60 + 1)) + 60}px`,
              }}
            />
          ))}
        </div>

        <CardsSkeletons needSection={false} />
      </PageSection>
    );

  return (
    <>
      <PageSection>
        <div className="flex flex-col gap-3">
          <Title title={t("title")} />
          <div className="flex flex-wrap gap-2">
            {genres?.genres?.map(renderGenreButton)}
          </div>
        </div>

        <main
          className="mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4
            lg:grid-cols-5 gap-4 place-items-center min-h-screen relative"
        >
          {isFetching ? (
            <SiSpinrilla className="absolute top-20 text-6xl text-white animate-spin" />
          ) : (
            content?.results?.map((item, idx: number) => {
              if (!item.poster_path) return null;
              const name =
                "original_title" in item
                  ? (item.title ?? item.original_title)
                  : (item.name ?? item.original_name);
              const releaseDate =
                "release_date" in item
                  ? item.release_date
                  : item.first_air_date;

              return (
                <motion.div key={item.id} layoutId={String(item.id)}>
                  <Card
                    theShow={item}
                    name={name}
                    id={item.id}
                    src={baseImgUrl + item.poster_path}
                    showType={showType}
                    rating={item.vote_average}
                    release_date={releaseDate}
                    alt={name}
                    idx={idx}
                  />
                </motion.div>
              );
            })
          )}
        </main>

        {content && content.total_pages > 1 && (
          <Pagination
            isLoading={isLoading}
            isFetching={isFetching}
            currentPage={page}
            totalPages={content.total_pages}
            setPage={setPage}
          />
        )}
      </PageSection>
    </>
  );
};

export default GenresComp;
