"use client";
import Card from "@/app/_Components/Card/Card";
import PageSection from "@/app/_Components/PageSection/PageSection";
import Pagination from "@/app/_Components/Pagination/Pagination";
import Title from "@/app/_Components/Title/Title";
import { motion } from "framer-motion";
import { useCallback, useMemo, useState } from "react";
import { useRouter as useNextIntlRouter } from "@/i18n/navigation";
import { useRouter } from "@bprogress/next/app";
import dynamic from "next/dynamic";
import { CompanyDetailsResponse } from "@/app/interfaces/apiInterfaces/CompanyDetailsInterfaces";
import Image from "next/image";
import CompanyDetails from "./CompanyDetails";
import { useTranslations } from "next-intl";
import { useGetMoviesTvShowsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import {
  MoviesResponse,
  TVShowsResponse,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";

const CardsSkeletons = dynamic(() => import("../Card/CardsSkeletons"));
const CompanyDetailsSkeleton = dynamic(
  () => import("./CompanyDetailsSkeleton"),
);

const baseImgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL_W500;

type CompanyCompProps = {
  showType: "movie" | "tv";
  companyDetails: CompanyDetailsResponse;
  companyShows: MoviesResponse | TVShowsResponse;
  companyId: string;
  pageParam: number;
};

const CompanyComp = ({
  showType,
  companyDetails,
  companyShows,
  companyId,
  pageParam,
}: CompanyCompProps) => {
  const router = useRouter({ customRouter: useNextIntlRouter });
  const t = useTranslations("CompanyPage");

  const tabs: { query: "tv" | "movie"; title: string }[] = [
    { query: "movie", title: t("tabs.moviesTab") },
    { query: "tv", title: t("tabs.tvShowsTab") },
  ];

  const [page, setPage] = useState(pageParam);
  const [movieOrTv, setMovieOrTv] = useState(showType);

  const { data, isLoading, isFetching, isError } = useGetMoviesTvShowsQuery({
    page,
    showType: movieOrTv,
    companies: companyId,
    sortBy: "",
  });

  const filteredData = useMemo(() => {
    return data?.results.filter((show) => show.poster_path);
  }, [data]);

  const handleMovieOrTv = useCallback(
    (query: typeof showType) => {
      if (query === movieOrTv || (query === movieOrTv && page === 1)) return;

      setMovieOrTv(query);

      if (page !== 1) {
        setPage(1);

        router.replace(`?page=1`, { scroll: false });
      }
    },
    [page, router, movieOrTv],
  );

  const title =
    movieOrTv === "movie"
      ? t("moviesTitle", { name: companyDetails.name })
      : t("tvShowsTitle", { name: companyDetails.name });

  if (isError || !companyDetails)
    return (
      <div className="text-red-500 text-center h-screen flex items-center justify-center">
        Error loading data
      </div>
    );

  if (!companyDetails || !companyShows)
    return (
      <PageSection className={`${companyDetails?.logo_path ? "pt-48" : ""}`}>
        <CompanyDetailsSkeleton />
        <div className="flex flex-col gap-2 sm:gap-5 sm:flex-row items-center justify-between flex-wrap">
          <Title title={title} />
          <div className="flex gap-2 rounded-full bg-black shadow-blueGlow overflow-hidden w-[188px]">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className={`px-6 py-2 rounded-full bg-gray-800 animate-pulse h-10
                ${i === 0 ? "w-[40%]" : "w-[60%]"}`}
              />
            ))}
          </div>
        </div>
        <CardsSkeletons needSection={false} />
      </PageSection>
    );

  return (
    <>
      {/* Company Details Background */}
      {companyDetails.logo_path && (
        <div className="min-h-screen fixed w-full -z-10">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}${companyDetails?.logo_path}`}
            alt={companyDetails?.name || "background"}
            fill
            quality={75}
            sizes="100vw"
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/90" />
        </div>
      )}

      <PageSection className={`${companyDetails?.logo_path ? "pt-48" : ""}`}>
        {/* company details */}
        <CompanyDetails
          companyDetails={companyDetails}
          showType={movieOrTv}
          t={t}
        />
        {/* header */}
        <div className="flex flex-wrap gap-2 sm:gap-5 justify-center items-center sm:justify-between">
          <Title title={title} className="sm:!mb-0" />

          <div className="flex gap-2 rounded-full bg-black shadow-blueGlow overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.query}
                className="disabled:cursor-not-allowed disabled:opacity-50 relative px-4 py-2 rounded-full
                  hover:bg-gray-900 transition-colors duration-200"
                onClick={() => handleMovieOrTv(tab.query)}
              >
                {movieOrTv === tab.query && (
                  <motion.span
                    initial={false}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    layoutId="trendingTabs"
                    className="absolute inset-0 bg-blue-900 rounded-full"
                  />
                )}
                <span className="relative z-10">{tab.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* cards */}
        {isLoading ? (
          <CardsSkeletons needSection={false} />
        ) : !data?.results.length ? (
          <p className="text-center text-2xl text-red-400 font-semibold mt-20">
            {movieOrTv === "movie" ? t("noMovies") : t("noTvShows")}
          </p>
        ) : (
          <>
            <main
              className="mt-10 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                lg:grid-cols-5 gap-4 place-items-center"
            >
              {filteredData?.map((item, idx) => {
                const name =
                  "title" in item
                    ? (item.title ?? item.original_title)
                    : (item.name ?? item.original_name);
                const releaseDate =
                  "release_date" in item
                    ? item.release_date
                    : item.first_air_date;

                return (
                  <Card
                    key={item.id}
                    theShow={item}
                    idx={idx}
                    name={name}
                    id={item.id}
                    src={baseImgUrl + item.poster_path}
                    showType={showType}
                    rating={item.vote_average}
                    release_date={releaseDate}
                    alt={name}
                  />
                );
              })}
            </main>

            {data?.total_pages > 1 && (
              <Pagination
                isLoading={isLoading}
                isFetching={isFetching}
                currentPage={page}
                setPage={setPage}
                totalPages={data?.total_pages}
                scrollPx={400}
              />
            )}
          </>
        )}
      </PageSection>
    </>
  );
};

export default CompanyComp;
