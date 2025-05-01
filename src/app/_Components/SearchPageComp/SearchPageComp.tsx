"use client";
import CardsSlider from "@/app/_Components/CardsSlider/CardsSlider";
import MainLoader from "@/app/_Components/MainLoader/MainLoader";
import PageHeader from "@/app/_Components/PageHeader/PageHeader";
import Pagination from "@/app/_Components/Pagination/Pagination";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { SearchMovieResponse } from "@/app/interfaces/apiInterfaces/searchMovieInterfaces";
import {
  SearchPerson,
  SearchPersonResponse,
} from "@/app/interfaces/apiInterfaces/searchPersonInterfaces";
import { SearchTvShowResponse } from "@/app/interfaces/apiInterfaces/SearchTvshowInterfaces";
import tmdbApi, {
  useGetSearchMoviesQuery,
  useGetSearchPeopleQuery,
  useGetSearchTvShowsQuery,
} from "@/lib/Redux/apiSlices/tmdbSlice";
import { AppDispatch } from "@/lib/Redux/store";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

interface SearchPageCompProps {
  query: string;
  page: number;
  locale: "en" | "ar";
  initialMovies: SearchMovieResponse;
  initialTvShows: SearchTvShowResponse;
  initialPeople: SearchPersonResponse;
}

const SearchPageComp = ({
  query,
  page,
  initialMovies,
  initialTvShows,
  initialPeople,
}: SearchPageCompProps) => {
  const t = useTranslations("SearchPage");
  const [currentPage, setCurrentPage] = useState(page || 1);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (initialMovies) {
      dispatch(
        tmdbApi.util.upsertQueryData(
          "getSearchMovies",
          { query, page },
          initialMovies,
        ),
      );
    }
    if (initialTvShows) {
      dispatch(
        tmdbApi.util.upsertQueryData(
          "getSearchTvShows",
          { query, page },
          initialTvShows,
        ),
      );
    }
    if (initialPeople) {
      dispatch(
        tmdbApi.util.upsertQueryData(
          "getSearchPeople",
          { query, page },
          initialPeople,
        ),
      );
    }
  }, [initialMovies, initialTvShows, initialPeople, dispatch, query, page]);

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
      !movies?.results?.length &&
      !tvShows?.results?.length &&
      !ppl?.results?.length,
    [movies, tvShows, ppl],
  );

  const sliders = useMemo(
    () => [
      {
        data: movies?.results as Movie[],
        type: "movie",
        sliderType: "movies",
        title: t("Movies"),
      },
      {
        data: tvShows?.results as TVShow[],
        type: "tv",
        sliderType: "tvShows",
        title: t("TvShows"),
      },
      {
        data: ppl?.results as SearchPerson[],
        type: "person",
        sliderType: "People",
        title: t("Celebs"),
      },
    ],
    [movies?.results, tvShows?.results, ppl?.results, t],
  );

  const isLoading = isLoadingMovies || isLoadingTvShows || isLoadingPpl;

  const isFetching = isFetchingMovies || isFetchingTvShows || isFetchingPpl;

  const totalPages = useMemo(() => {
    if (movies?.total_pages && tvShows?.total_pages && ppl?.total_pages) {
      return Math.max(movies.total_pages, tvShows.total_pages, ppl.total_pages);
    }
    return 1;
  }, [movies?.total_pages, tvShows?.total_pages, ppl?.total_pages]);

  if (isLoading) {
    return <MainLoader />;
  }

  return (
    <>
      <PageHeader title={t("Header")} />
      <section className="px-3 sm:px-7 pt-20 lg:max-w-screen-xl mx-auto flex flex-col gap-11 mb-10">
        <h1 className="text-center text-4xl font-bold capitalize">
          {t("ResultsFor")}{" "}
          <span className="text-blue-600 text-5xl">{query}</span>
        </h1>
        {hasNoResults && (
          <p className="text-center text-4xl font-bold my-28">
            {t("NoResultsFound")}
          </p>
        )}
        {/* movies - people - tv */}
        {sliders.map(({ data, type, sliderType, title }, index) => (
          <CardsSlider
            key={index}
            theShows={data}
            showType={type as "movie" | "tv" | "person"}
            sliderType={sliderType as "movies" | "tvShows" | "People"}
            title={title}
          />
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            isLoading={isLoading}
            isFetching={isFetching}
            currentPage={currentPage}
            totalPages={totalPages}
            setPage={setCurrentPage}
          />
        )}
      </section>
    </>
  );
};

export default SearchPageComp;
