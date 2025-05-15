"use client";
import Card from "@/app/_Components/Card/Card";
import MultiSelectComp from "@/app/_Components/MultiSelectComp/MultiSelectComp";
import PageSection from "@/app/_Components/PageSection/PageSection";
import Pagination from "@/app/_Components/Pagination/Pagination";
import SelectComp from "@/app/_Components/SelectComp/SelectComp";
import Title from "@/app/_Components/Title/Title";
import {
  Movie,
  MoviesResponse,
  TVShow,
  TVShowsResponse,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import {
  useGetGenresQuery,
  useGetMoviesTvShowsQuery,
} from "@/lib/Redux/apiSlices/tmdbSlice";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { memo, useMemo, useState } from "react";
import {
  Filters,
  FilterConfig,
  FilterItem,
  filterOptionsWithT,
  yearsWithT,
} from "./showsNeeds";
import { useLocale, useTranslations } from "next-intl";
import { SiSpinrilla } from "@react-icons/all-files/si/SiSpinrilla";
import dynamic from "next/dynamic";

const DiscoverShowsSkeletons = dynamic(
  () => import("./DiscoverShowsSkeletons"),
);

type ShowType = "movie" | "tv";

interface Props {
  showType: ShowType;
  pageTitle: string;
}

const baseImgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL_W500;

const CardRenderer = memo(
  ({
    show,
    idx,
    showType,
  }: {
    show: Movie | TVShow;
    idx: number;
    showType: ShowType;
  }) => {
    const name =
      showType === "movie"
        ? ((show as Movie).title ?? (show as Movie).original_title)
        : ((show as TVShow).name ?? (show as TVShow).original_name);

    const date =
      showType === "movie"
        ? (show as Movie).release_date
        : (show as TVShow).first_air_date;

    if (!show.poster_path) return null;

    return (
      <motion.div layout>
        <Card
          theShow={show}
          name={name}
          id={show.id}
          src={baseImgUrl + show.poster_path}
          showType={showType}
          rating={show.vote_average}
          release_date={date}
          alt={name}
          idx={idx}
        />
      </motion.div>
    );
  },
);

CardRenderer.displayName = "CardRenderer";

const DiscoverShows = ({ showType, pageTitle }: Props) => {
  const locale = useLocale();
  const t = useTranslations("AllShows");
  const filterOptions = filterOptionsWithT({ t });
  const years = yearsWithT({ t });
  const params = useSearchParams();
  const genreQuery = params.get("genre");
  const genreName = params.get("genreName");
  const oriLang = params.get("oriLang");
  const sort = params.get("sortBy");
  const pageParam = Number(params.get("page"));

  const genreParam =
    genreQuery && genreName ? [{ query: genreQuery, name: genreName }] : [];

  const oriLangParam = oriLang
    ? { query: oriLang, name: oriLang }
    : filterOptions.oriLangs[0];

  const sortParam = sort
    ? { query: sort, name: sort }
    : filterOptions.sortItems[0];

  const [page, setPage] = useState(pageParam || 1);

  const [filters, setFilters] = useState<Filters>({
    rating: filterOptions.ratings[0],
    year: years[0],
    oriLang: oriLangParam,
    sort: sortParam,
    genres: genreParam,
  });

  const { data: genres, isLoading: isLoadingGenres } = useGetGenresQuery(
    { showType, lang: locale },
    {
      refetchOnMountOrArgChange: false,
      refetchOnReconnect: false,
    },
  );

  const genresList = useMemo(() => {
    return (
      genres?.genres.map((genre) => ({
        query: String(genre.id),
        name: genre.name,
      })) || []
    );
  }, [genres]);

  const filterConfigs = useMemo<FilterConfig[]>(() => {
    return [
      {
        id: "rating",
        items: filterOptions.ratings,
        label: t("Filters.Ratings.Label"),
        setPage: true,
      },
      {
        id: "year",
        items: years,
        label: t("Filters.Years.Label"),
        setPage: true,
      },
      {
        id: "oriLang",
        items: filterOptions.oriLangs,
        label: t("Filters.OriLangs.Label"),
        setPage: false,
      },
      {
        id: "genres",
        items: genresList,
        label: t("Filters.Genres.Label"),
        setPage: false,
        multiSelect: true,
        defaultOption: t("Filters.Genres.Options.All"),
      },
      {
        id: "sort",
        items: filterOptions.sortItems,
        label: t("Filters.SortBy.Label"),
        setPage: true,
      },
    ];
  }, [genresList, filterOptions, t, years]);

  const selectedGenresQuery = filters.genres.map((g) => g.query).join(",");

  const {
    data,
    isLoading: isLoadingShows,
    isFetching,
  } = useGetMoviesTvShowsQuery({
    showType,
    sortBy: filters.sort.query,
    page,
    genreNum: selectedGenresQuery,
    ori_lang: filters.oriLang.query,
    year: filters.year.query,
    rating: filters.rating.query,
  });

  const isLoading = isLoadingGenres || isLoadingShows;
  const results = (data as MoviesResponse | TVShowsResponse)?.results || [];
  const totalPages =
    (data as MoviesResponse | TVShowsResponse)?.total_pages || 1;

  if (isLoading)
    return (
      <DiscoverShowsSkeletons
        pageTitle={pageTitle}
        filterConfigs={filterConfigs}
      />
    );

  return (
    <PageSection>
      <div className="flex flex-col gap-2 sm:gap-5 sm:flex-row items-center justify-between flex-wrap">
        <Title title={pageTitle} className="!mb-0" />
        <div className="flex items-center justify-center gap-4 lg:gap-2 flex-wrap">
          {filterConfigs.map((config) =>
            config.multiSelect ? (
              <MultiSelectComp
                key={config.id}
                items={genresList}
                activeSelect={filters[config.id] as FilterItem[]}
                setActiveSelect={(value) =>
                  setFilters((prev) => ({ ...prev, genres: value }))
                }
                label={config.label}
                setPage={setPage}
                defaultOption={config.defaultOption}
              />
            ) : (
              <SelectComp
                key={config.id}
                items={config.items}
                activeSelect={filters[config.id] as FilterItem}
                setActiveSelect={(value) =>
                  setFilters((prev) => ({ ...prev, [config.id]: value }))
                }
                label={config.label}
                setPage={config.setPage ? setPage : undefined}
              />
            ),
          )}
        </div>
      </div>

      <div className="mt-10 min-h-screen relative">
        {isFetching ? (
          <div className="absolute left-1/2 -translate-x-1/2 top-20 flex items-center justify-center">
            <SiSpinrilla className="text-6xl text-white animate-spin" />
          </div>
        ) : (
          <div
            className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5
              gap-4 place-items-center"
          >
            {results.map((item, idx) => (
              <CardRenderer
                key={item.id}
                show={item}
                idx={idx}
                showType={showType}
              />
            ))}
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          isFetching={isFetching}
          isLoading={isLoading}
          currentPage={page}
          totalPages={totalPages}
          setPage={setPage}
        />
      )}
    </PageSection>
  );
};

export default DiscoverShows;
