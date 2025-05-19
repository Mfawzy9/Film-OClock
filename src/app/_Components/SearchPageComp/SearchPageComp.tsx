"use client";
import CardsSlider from "@/app/_Components/CardsSlider/CardsSlider";
import PageHeader from "@/app/_Components/PageHeader/PageHeader";
import Pagination from "@/app/_Components/Pagination/Pagination";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { SearchPerson } from "@/app/interfaces/apiInterfaces/searchPersonInterfaces";
import {
  useGetSearchMoviesQuery,
  useGetSearchPeopleQuery,
  useGetSearchTvShowsQuery,
} from "@/lib/Redux/apiSlices/tmdbSlice";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

interface SearchPageCompProps {
  query: string;
  page: number;
  results: string;
}

const SearchPageComp = ({ query, page, results }: SearchPageCompProps) => {
  const t = useTranslations("SearchPage");
  const [currentPage, setCurrentPage] = useState(page || 1);

  //*movies
  const {
    data: movies,
    isLoading: isLoadingMovies,
    isFetching: isFetchingMovies,
  } = useGetSearchMoviesQuery({
    query,
    page: currentPage,
  });
  //*tvShows
  const {
    data: tvShows,
    isLoading: isLoadingTvShows,
    isFetching: isFetchingTvShows,
  } = useGetSearchTvShowsQuery({ query, page: currentPage });
  //*people
  const {
    data: ppl,
    isLoading: isLoadingPpl,
    isFetching: isFetchingPpl,
  } = useGetSearchPeopleQuery({
    query,
    page: currentPage,
  });

  const hasNoResults = useMemo(
    () =>
      (results === "0" || !results) &&
      !movies?.results?.length &&
      !tvShows?.results?.length &&
      !ppl?.results?.length,
    [movies, tvShows, ppl, results],
  );

  const sliders = useMemo(
    () => [
      {
        data: movies?.results as Movie[],
        type: "movie",
        sliderType: "movies",
        title: t("Movies"),
        isLoading: isLoadingMovies || isFetchingMovies,
      },
      {
        data: tvShows?.results as TVShow[],
        type: "tv",
        sliderType: "tvShows",
        title: t("TvShows"),
        isLoading: isLoadingTvShows || isFetchingTvShows,
      },
      {
        data: ppl?.results as SearchPerson[],
        type: "person",
        sliderType: "People",
        title: t("Celebs"),
        isLoading: isLoadingPpl || isFetchingPpl,
      },
    ],
    [
      movies?.results,
      tvShows?.results,
      ppl?.results,
      t,
      isLoadingMovies,
      isLoadingTvShows,
      isLoadingPpl,
      isFetchingMovies,
      isFetchingTvShows,
      isFetchingPpl,
    ],
  );

  const isLoadingAll = isLoadingMovies || isLoadingTvShows || isLoadingPpl;

  const isFetchingAll = isFetchingMovies || isFetchingTvShows || isFetchingPpl;

  const totalPages = useMemo(() => {
    if (movies?.total_pages && tvShows?.total_pages && ppl?.total_pages) {
      return Math.max(movies.total_pages, tvShows.total_pages, ppl.total_pages);
    }
    return 1;
  }, [movies?.total_pages, tvShows?.total_pages, ppl?.total_pages]);

  return (
    <>
      <PageHeader title={t("Header")} />
      <section className="px-3 sm:px-7 pt-20 lg:max-w-screen-xl mx-auto flex flex-col gap-11 mb-10">
        {hasNoResults && !isLoadingAll ? (
          <p className="text-center text-4xl font-bold my-28">
            {t("NoResultsFound")}
          </p>
        ) : (
          <>
            <h1 className="text-center text-4xl font-bold capitalize">
              {t("ResultsFor")}{" "}
              <span className="text-blue-600 text-5xl break-words">
                {query}
              </span>
            </h1>
            {/* movies - people - tv */}
            {sliders.map(
              ({ data, type, sliderType, title, isLoading }, index) => (
                <CardsSlider
                  key={index}
                  theShows={data}
                  showType={type as "movie" | "tv" | "person"}
                  sliderType={sliderType as "movies" | "tvShows" | "People"}
                  title={title}
                  isLoading={isLoading}
                />
              ),
            )}
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                isLoading={isLoadingAll}
                isFetching={isFetchingAll}
                currentPage={currentPage}
                totalPages={totalPages}
                setPage={setCurrentPage}
              />
            )}
          </>
        )}
      </section>
    </>
  );
};

export default SearchPageComp;
