"use client";

import { useMemo } from "react";
import { useRandomShow } from "@/app/hooks/useRandomShow";
import {
  useGetGenresQuery,
  useGetMoviesTvShowsQuery,
  useGetTopRatedQuery,
  useLazyGetVideosQuery,
} from "@/lib/Redux/apiSlices/tmdbSlice";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import PageSection from "@/app/_Components/PageSection/PageSection";
import { useParams } from "next/navigation";
import PageHeader from "@/app/_Components/PageHeader/PageHeader";
import { BiSolidMoviePlay } from "react-icons/bi";
import { MdLiveTv } from "react-icons/md";
import { useLocale, useTranslations } from "next-intl";
import LazyRender from "../LazyRender/LazyRender";
import dynamic from "next/dynamic";
import CardsSkeletonSlider from "../CardsSlider/CardsSkeletonSlider";
import VideosSkelsetonSlider from "../VideosSlider/VideosSkelsetonSlider";
import HoriSkeletonSlider from "../HoriCardsSlider/HoriSkeletonSlider";
import GenresSkeletonSlider from "../GenresSlider/GenresSkeletonSlider";
import ShortDetailsSkeleton from "../ShortDetails/ShortDetailsSkeleton";

const CardsSlider = dynamic(() => import("../CardsSlider/CardsSlider"));
const ShortDetails = dynamic(
  () => import("@/app/_Components/ShortDetails/ShortDetails"),
);
const VideosSlider = dynamic(
  () => import("@/app/_Components/VideosSlider/VideosSlider"),
);
const HoriCardsSlider = dynamic(
  () => import("@/app/_Components/HoriCardsSlider/HoriCardsSlider"),
);
const GenresSection = dynamic(
  () => import("@/app/_Components/GenresSection/GenresSection"),
);

// 🔹 Type guards
const isMovie = (item: Movie | TVShow): item is Movie =>
  "original_title" in item && "release_date" in item && "title" in item;

const isTVShow = (item: Movie | TVShow): item is TVShow =>
  "original_name" in item && "first_air_date" in item && "name" in item;

const isValidMovie = (item: Movie | TVShow): item is Movie =>
  isMovie(item) &&
  !!item.original_title?.trim() &&
  !!item.overview?.trim() &&
  !!item.poster_path?.trim();

const isValidTVShow = (item: Movie | TVShow): item is TVShow =>
  isTVShow(item) &&
  !!item.original_name?.trim() &&
  !!item.overview?.trim() &&
  !!item.poster_path?.trim();

const Explore = () => {
  const locale = useLocale();
  const { showType } = useParams<{ showType: "movie" | "tv" }>();

  const t = useTranslations("Explore");

  const { data: popularShows, isLoading: popularLoading } =
    useGetMoviesTvShowsQuery({ showType, year: "2025" });

  const { data: actionShows, isLoading: actionLoading } =
    useGetMoviesTvShowsQuery({
      showType,
      genreNum: showType === "movie" ? "28" : "10759",
    });

  const { data: topRatedShows, isLoading: topRatedLoading } =
    useGetTopRatedQuery({ showType, page: 1 });

  const { data: familyShows, isLoading: familyLoading } =
    useGetMoviesTvShowsQuery({ showType, genreNum: "10751" });

  const { data: arabicShows, isLoading: arabicLoading } =
    useGetMoviesTvShowsQuery({ showType, ori_lang: "ar" });

  const { data: comingShows, isLoading: comingLoading } =
    useGetMoviesTvShowsQuery({
      showType,
      year: "2025",
    });

  const { data: genres, isLoading: genresLoading } = useGetGenresQuery({
    showType,
    lang: locale,
  });

  const [getVideos, { isLoading: videosLoading }] = useLazyGetVideosQuery();

  const filteredPopular = useMemo(
    () =>
      popularShows?.results?.filter(
        showType === "movie" ? isValidMovie : isValidTVShow,
      ) ?? [],
    [popularShows, showType],
  );

  const filteredAction = useMemo(
    () =>
      actionShows?.results?.filter(
        showType === "movie" ? isValidMovie : isValidTVShow,
      ) ?? [],
    [actionShows, showType],
  );

  const filteredtopRated = useMemo(
    () =>
      topRatedShows?.results?.filter(
        showType === "movie" ? isValidMovie : isValidTVShow,
      ) ?? [],
    [topRatedShows, showType],
  );

  const filteredFamily = useMemo(
    () =>
      familyShows?.results?.filter(
        showType === "movie" ? isValidMovie : isValidTVShow,
      ) ?? [],
    [familyShows, showType],
  );

  const filteredArabic = useMemo(
    () =>
      arabicShows?.results?.filter(
        showType === "movie" ? isValidMovie : isValidTVShow,
      ) ?? [],
    [arabicShows, showType],
  );

  const filteredComing = useMemo(
    () =>
      comingShows?.results?.filter(
        showType === "movie" ? isValidMovie : isValidTVShow,
      ) ?? [],
    [comingShows, showType],
  );

  const randomComing = useRandomShow(filteredComing as Movie[] | TVShow[]) as
    | Movie
    | TVShow;
  const randomTopRatedShow = useRandomShow(
    filteredtopRated as Movie[] | TVShow[],
  ) as Movie | TVShow;

  return (
    <>
      <div className="absolute left-0 right-0 top-0">
        <PageHeader
          title={
            <div className="flex items-center gap-2">
              {showType === "movie" ? (
                <>
                  <BiSolidMoviePlay /> {t("Movies/Explore.title")}
                </>
              ) : (
                <>
                  <MdLiveTv /> {t("TvShows/Explore.title")}
                </>
              )}
            </div>
          }
        />
      </div>

      {/* popular shows */}
      {popularLoading ? (
        <PageSection>
          <CardsSkeletonSlider />
        </PageSection>
      ) : (
        <PageSection>
          <CardsSlider
            showType={showType}
            theShows={filteredPopular as TVShow[] | Movie[]}
            sliderType="tvShows"
            title={
              showType === "movie"
                ? t("Movies/Explore.PopularMovies")
                : t("TvShows/Explore.PopularTvShows")
            }
            pageLink={
              showType === "movie"
                ? "/shows/popular/movie?page=1"
                : "/shows/popular/tv?page=1"
            }
            isLoading={popularLoading}
            autoPlay={false}
          />
        </PageSection>
      )}

      {/* random coming soon */}
      {comingLoading ? (
        <ShortDetailsSkeleton className="!my-0 !py-0" />
      ) : randomComing ? (
        <PageSection className="!my-0 !py-0">
          <LazyRender
            Component={ShortDetails}
            props={{
              className: "!my-0",
              scroll: false,
              theShow: randomComing,
              title:
                showType === "movie"
                  ? ((randomComing as Movie).title ??
                    (randomComing as Movie).original_title)
                  : ((randomComing as TVShow).name ??
                    (randomComing as TVShow).original_name),
              description: randomComing.overview,
              rating: randomComing.vote_average,
              releaseDate:
                showType === "movie"
                  ? (randomComing as Movie).release_date
                  : (randomComing as TVShow).first_air_date,
              backdropPath: `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}${randomComing.backdrop_path}`,
              genresIds: randomComing.genre_ids,
              showType,
              showId: randomComing.id,
            }}
            loading={<ShortDetailsSkeleton className="!my-0 !py-0" />}
            rootMargin="0px 0px"
          />
        </PageSection>
      ) : null}

      {/* latest trailers */}
      {comingLoading || videosLoading ? (
        <VideosSkelsetonSlider />
      ) : (
        <LazyRender
          Component={VideosSlider}
          props={{
            theShows: filteredComing as Movie[] | TVShow[],
            showType,
            title:
              showType === "movie"
                ? t("Movies/Explore.LatestTrailers")
                : t("TvShows/Explore.LatestTrailers"),
            pageLink:
              showType === "movie"
                ? "/movies/Upcoming?page=1"
                : "/shows/trending/tv?page=1",
            getVideos,
            isLoading: comingLoading || videosLoading,
          }}
          loading={<VideosSkelsetonSlider />}
          rootMargin="400px 0px"
        />
      )}

      {/* action shows */}
      {actionLoading ? (
        <HoriSkeletonSlider />
      ) : (
        <LazyRender
          Component={HoriCardsSlider}
          props={{
            data: filteredAction as Movie[] | TVShow[],
            pageLink:
              showType === "movie"
                ? `/shows/all/movie?page=1&genre=28&genreName=${t(
                    "Movies/Explore.ActionGenreName",
                  )}`
                : `/shows/all/tv?page=1&genre=10759&genreName=${t(
                    "TvShows/Explore.ActionGenreName",
                  )}`,
            title:
              showType === "movie"
                ? t("Movies/Explore.ActionMovies")
                : t("TvShows/Explore.ActionTvShows"),
            sliderType: showType,
            isLoading: actionLoading,
          }}
          loading={<HoriSkeletonSlider />}
          rootMargin="0px 0px"
        />
      )}

      {/* random top rated show */}
      {topRatedLoading ? (
        <ShortDetailsSkeleton className="!my-0 !pt-10 !pb-0" />
      ) : (
        randomTopRatedShow && (
          <PageSection className="!my-0 !pt-10 !pb-0">
            <LazyRender
              Component={ShortDetails}
              props={{
                className: "!my-0",
                scroll: false,
                theShow: randomTopRatedShow,
                title:
                  showType === "movie"
                    ? ((randomTopRatedShow as Movie).title ??
                      (randomTopRatedShow as Movie).original_title)
                    : ((randomTopRatedShow as TVShow).name ??
                      (randomTopRatedShow as TVShow).original_name),
                description: randomTopRatedShow.overview,
                rating: randomTopRatedShow.vote_average,
                releaseDate:
                  showType === "movie"
                    ? (randomTopRatedShow as Movie).release_date
                    : (randomTopRatedShow as TVShow).first_air_date,
                backdropPath: `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}${randomTopRatedShow.backdrop_path}`,
                genresIds: randomTopRatedShow.genre_ids,
                showType,
                showId: randomTopRatedShow.id,
              }}
              loading={<ShortDetailsSkeleton className="!my-0 !pt-10 !pb-0" />}
              rootMargin="0px 0px"
            />
          </PageSection>
        )
      )}

      {/* arabic shows */}
      {arabicLoading ? (
        <PageSection className="!pb-0">
          <CardsSkeletonSlider />
        </PageSection>
      ) : (
        <PageSection className="!pb-0">
          <LazyRender
            Component={CardsSlider}
            props={{
              showType,
              theShows: filteredArabic as Movie[] | TVShow[],
              sliderType: showType === "movie" ? "movies" : "tvShows",
              title:
                showType === "movie"
                  ? t("Movies/Explore.ArabicMovies")
                  : t("TvShows/Explore.ArabicTvShows"),
              pageLink:
                showType === "movie"
                  ? "/shows/all/movie?page=1&oriLang=ar"
                  : "/shows/all/tv?page=1&oriLang=ar",
              isLoading: arabicLoading,
            }}
            loading={<CardsSkeletonSlider arrLength={filteredArabic?.length} />}
            rootMargin="0px 0px"
          />
        </PageSection>
      )}

      {/* family shows */}
      {familyLoading ? (
        <HoriSkeletonSlider />
      ) : (
        <LazyRender
          Component={HoriCardsSlider}
          props={{
            data: filteredFamily as Movie[] | TVShow[],
            pageLink:
              showType === "movie"
                ? `/shows/all/movie?page=1&genre=10751&genreName=${t("Movies/Explore.FamilyGenreName")}`
                : `/shows/all/tv?page=1&genre=10751&genreName=${t("TvShows/Explore.FamilyGenreName")}`,
            title:
              showType === "movie"
                ? t("Movies/Explore.FamilyMovies")
                : t("TvShows/Explore.FamilyTvShows"),
            sliderType: showType,
            isLoading: familyLoading,
          }}
          loading={<HoriSkeletonSlider />}
          rootMargin="0px 0px"
        />
      )}

      {/* genres */}
      {genresLoading || popularLoading ? (
        <GenresSkeletonSlider />
      ) : (
        <LazyRender
          Component={GenresSection}
          props={{
            showType,
            genresList: genres?.genres || [],
            moviesOrTvShows: filteredPopular as Movie[] | TVShow[],
            pageLink:
              showType === "movie"
                ? "/shows/genres/movie?page=1"
                : "/shows/genres/tv?page=1",
            isLoading: genresLoading || popularLoading,
          }}
          loading={<GenresSkeletonSlider />}
          rootMargin="0px 0px"
        />
      )}
    </>
  );
};

export default Explore;
