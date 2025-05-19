"use client";
import { useMemo } from "react";
import { useRandomShow } from "@/app/hooks/useRandomShow";
import {
  useGetGenresQuery,
  useGetMoviesTvShowsQuery,
  useGetPopularQuery,
  useGetTopRatedQuery,
  useGetTrendsQuery,
  useLazyGetVideosQuery,
} from "@/lib/Redux/apiSlices/tmdbSlice";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import PageSection from "@/app/_Components/PageSection/PageSection";
import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import LazyRender from "../LazyRender/LazyRender";
import dynamic from "next/dynamic";
import {
  MoviesTrendsResponse,
  TVShowsTrendsResponse,
} from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import {
  PopularMoviesResponse,
  PopularTvShowResponse,
} from "@/app/interfaces/apiInterfaces/popularMoviesTvInterfaces";

const CardsSkeletonSlider = dynamic(
  () => import("../CardsSlider/CardsSkeletonSlider"),
);
const VideosSkelsetonSlider = dynamic(
  () => import("../VideosSlider/VideosSkelsetonSlider"),
);
const HoriSkeletonSlider = dynamic(
  () => import("../HoriCardsSlider/HoriSkeletonSlider"),
);
const GenresSkeletonSlider = dynamic(
  () => import("../GenresSlider/GenresSkeletonSlider"),
);
const ShortDetailsSkeleton = dynamic(
  () => import("../ShortDetails/ShortDetailsSkeleton"),
);
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

  const { data: popularShows, isLoading: popularLoading } = useGetPopularQuery({
    page: 1,
    showType,
  });

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

  const { data: trendingShows, isLoading: trendingLoading } = useGetTrendsQuery(
    {
      showType,
      dayOrWeek: "day",
      page: 1,
      lang: "en",
    },
  );

  const { data: genres, isLoading: genresLoading } = useGetGenresQuery({
    showType,
    lang: locale,
  });

  const [getVideos, { isLoading: videosLoading, isFetching: videosFetching }] =
    useLazyGetVideosQuery();

  const filteredPopular = useMemo(
    () =>
      (
        popularShows as PopularMoviesResponse | PopularTvShowResponse
      )?.results?.filter(showType === "movie" ? isValidMovie : isValidTVShow) ??
      [],
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

  const filterTrending = useMemo(
    () =>
      (
        trendingShows as MoviesTrendsResponse | TVShowsTrendsResponse
      )?.results?.filter(showType === "movie" ? isValidMovie : isValidTVShow) ??
      [],
    [trendingShows, showType],
  );

  const randomTrendingShow = useRandomShow(
    filterTrending as Movie[] | TVShow[],
  ) as Movie | TVShow;
  const randomTopRatedShow = useRandomShow(
    filteredtopRated as Movie[] | TVShow[],
  ) as Movie | TVShow;

  return (
    <>
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
      {trendingLoading ? (
        <ShortDetailsSkeleton className="!my-0 !py-0" />
      ) : randomTrendingShow ? (
        <PageSection className="!my-0 !py-0">
          <LazyRender
            Component={ShortDetails}
            props={{
              className: "!my-0",
              scroll: false,
              theShow: randomTrendingShow,
              title:
                showType === "movie"
                  ? ((randomTrendingShow as Movie).title ??
                    (randomTrendingShow as Movie).original_title)
                  : ((randomTrendingShow as TVShow).name ??
                    (randomTrendingShow as TVShow).original_name),
              description: randomTrendingShow.overview,
              rating: randomTrendingShow.vote_average,
              releaseDate:
                showType === "movie"
                  ? (randomTrendingShow as Movie).release_date
                  : (randomTrendingShow as TVShow).first_air_date,
              backdropPath: `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}${randomTrendingShow.backdrop_path}`,
              genresIds: randomTrendingShow.genre_ids,
              showType,
              showId: randomTrendingShow.id,
            }}
            loading={<ShortDetailsSkeleton className="!my-0 !py-0" />}
          />
        </PageSection>
      ) : null}

      {/* latest trailers */}
      {trendingLoading || videosLoading || videosFetching ? (
        <VideosSkelsetonSlider />
      ) : (
        <LazyRender
          Component={VideosSlider}
          props={{
            theShows: filterTrending as Movie[] | TVShow[],
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
            isLoading: trendingLoading || videosLoading || videosFetching,
          }}
          loading={<VideosSkelsetonSlider />}
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
        />
      )}
    </>
  );
};

export default Explore;
