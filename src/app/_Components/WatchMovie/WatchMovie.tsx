"use client";

import {
  useGetMTDetailsQuery,
  useGetTranslationsQuery,
} from "@/lib/Redux/apiSlices/tmdbSlice";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Title from "../Title/Title";
import { MovieDetailsResponse } from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import PageSection from "../PageSection/PageSection";
import {
  getShowTitle,
  minutesToHours,
  nameToSlug,
} from "../../../../helpers/helpers";
import SelectComp from "../SelectComp/SelectComp";
import Casts from "../Casts/Casts";
import fallbackBg from "../../../../public/images/fallback-bg.jpg";
import {
  getMovieWatchServers,
  serversNames,
} from "../../../../helpers/watchServers";
import { Movie } from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { Link } from "@/i18n/navigation";
import { WatchedMovieHistoryItem } from "@/app/interfaces/localInterfaces/watchHistoryInterfaces";
import { useTranslations } from "next-intl";
import useIsArabic from "@/app/hooks/useIsArabic";
import { useGetGenres } from "@/app/hooks/useGetGenres";
import dynamic from "next/dynamic";
import Image from "next/image";
import LazyRender from "../LazyRender/LazyRender";
import ComingSoon from "../ComingSoon/ComingSoon";
import { CgSpinner } from "@react-icons/all-files/cg/CgSpinner";
import { FaGlobeAmericas } from "@react-icons/all-files/fa/FaGlobeAmericas";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import { FcCalendar } from "@react-icons/all-files/fc/FcCalendar";
import { FcClock } from "@react-icons/all-files/fc/FcClock";

const SkeletonMovieCollectionBanner = dynamic(
  () => import("../MovieCollectionBanner/SkeletonMovieCollectionBanner"),
);
const CardsSkeletonSlider = dynamic(
  () => import("../CardsSlider/CardsSkeletonSlider"),
);
const CardsSlider = dynamic(() => import("../CardsSlider/CardsSlider"));
const MovieCollectionBanner = dynamic(
  () => import("../MovieCollectionBanner/MovieCollectionBanner"),
);
const WatchMovieSkeleton = dynamic(() => import("./WatchMovieSkeleton"));

interface WatchMovieProps {
  showType: "movie" | "tv";
  showId: number;
}

const WatchMovie = ({ showType, showId }: WatchMovieProps) => {
  const { isArabic } = useIsArabic();
  const t = useTranslations("WatchMovie");
  const [activeServer, setActiveServer] = useState(
    (typeof window !== "undefined" &&
      JSON.parse(sessionStorage.getItem("activeServer") as string)) ??
      serversNames[0],
  );

  //save active server in session storage
  useEffect(() => {
    if (typeof window !== "undefined")
      sessionStorage.setItem("activeServer", JSON.stringify(activeServer));
  }, [activeServer]);

  const { data: movie, isLoading: movieLoading } = useGetMTDetailsQuery(
    { showType, showId },
    { skip: !showId },
  ) as { data: MovieDetailsResponse; isLoading: boolean };

  const videoPlayerRef = useRef<HTMLDivElement>(null);
  const serverOptions = useMemo(() => serversNames, []);

  //get translated genres
  const { genresLoading, translatedGenres } = useGetGenres({
    showType: "movie",
    lang: isArabic ? "ar" : "en",
  });

  const { data: movieTranslations, isLoading: movieTranslationsLoading } =
    useGetTranslationsQuery(
      { showId, showType },
      { skip: !isArabic || !showId },
    );

  const finalOverview = useMemo(() => {
    const arabicAeOverview = movieTranslations?.translations
      .find(
        (translation) =>
          translation.iso_639_1 === "ar" && translation.iso_3166_1 === "AE",
      )
      ?.data?.overview.trim();
    const arabicSaOverview = movieTranslations?.translations
      .find(
        (translation) =>
          translation.iso_639_1 === "ar" && translation.iso_3166_1 === "SA",
      )
      ?.data?.overview.trim();

    return (
      arabicAeOverview || arabicSaOverview || movie?.overview?.trim() || ""
    );
  }, [movieTranslations?.translations, movie?.overview]);

  const cast = useMemo(
    () =>
      movie?.credits?.cast?.filter(
        (c, i, arr) => i === arr.findIndex((w) => w.id === c.id),
      ) || [],
    [movie?.credits?.cast],
  );

  const recommendations = useMemo(
    () => (movie?.recommendations?.results as Movie[]) || [],
    [movie?.recommendations?.results],
  );

  const similarMovies = useMemo(
    () => (movie?.similar?.results as Movie[]) || [],
    [movie?.similar?.results],
  );

  const durationRef = useRef(movie?.runtime || 0);
  const watchedRef = useRef(0);

  // Load saved progress when component mounts or movie changes
  useEffect(() => {
    if (!movie) return;

    const savedHistory = JSON.parse(
      localStorage.getItem("WatchedHistory") || "{}",
    );
    const savedProgress = savedHistory[movie.id]?.progress;

    if (savedProgress) {
      durationRef.current = savedProgress.duration || movie.runtime || 0;
      watchedRef.current = savedProgress.watched || 0;
    }
  }, [movie]);

  // Memoized handler for localStorage updates
  const updateWatchedHistory = useCallback(
    (progressData: { watched: number; duration: number }) => {
      if (!movie) return;
      if (new Date(movie?.release_date) >= new Date()) return;

      const now = new Date();
      const duration = progressData.duration || durationRef.current;
      const watched = progressData.watched || watchedRef.current;

      // Update refs with current values
      durationRef.current = duration;
      watchedRef.current = watched;

      const data: WatchedMovieHistoryItem = {
        id: movie.id,
        showType: "movie",
        title: movie.title || movie.original_title,
        oriTitle: movie.original_title,
        original_language: movie.original_language,
        overview: movie.overview,
        posterPath: movie.poster_path,
        backdropPath: movie.backdrop_path,
        movieRuntime: movie.runtime || 0,
        progress: {
          watched,
          duration,
          percentage:
            duration > 0 ? Math.min((watched / duration) * 100, 100) : 0,
        },
        watchedAt: now.toLocaleDateString(),
        watchedTime: now.toLocaleTimeString(),
        watchedCount: 1,
        releaseDate: movie.release_date ?? null,
        rating: movie?.vote_average,
        genresIds: movie?.genres?.map((genre) => genre.id),
      };

      const prev = JSON.parse(localStorage.getItem("WatchedHistory") || "{}");
      localStorage.setItem(
        "WatchedHistory",
        JSON.stringify({
          ...prev,
          [movie.id]: data,
        }),
      );
    },
    [movie],
  );

  // Message handler effect
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.origin === "https://vidsrc.cc" &&
        event.data.type === "PLAYER_EVENT"
      ) {
        const watched = event?.data?.data?.currentTime;
        const duration = event?.data?.data?.duration;
        watchedRef.current = watched;
        durationRef.current = duration;
        updateWatchedHistory({ watched, duration });
      } else if (
        ["https://vidlink.pro", "https://www.vidsrc.wtf"].includes(
          event.origin,
        ) &&
        event.data?.type === "MEDIA_DATA"
      ) {
        const progress = event?.data?.data[movie?.id]?.progress;
        if (progress) {
          watchedRef.current = progress.watched;
          durationRef.current = progress.duration;
          updateWatchedHistory(progress);
        }
      } else if (
        event.origin === "https://vidjoy.pro" &&
        event.data?.type === "MEDIA_DATA"
      ) {
        const progress = event?.data[movie?.id]?.progress;
        if (progress) {
          watchedRef.current = progress.watched;
          durationRef.current = progress.duration;
          updateWatchedHistory(progress);
        }
      } else if (
        event.origin === "https://vidfast.pro" &&
        event.data?.type === "MEDIA_DATA"
      ) {
        const progress = event?.data?.data[`m${movie?.id}`]?.progress;
        if (progress) {
          watchedRef.current = progress.watched;
          durationRef.current = progress.duration;
          updateWatchedHistory(progress);
        }
      } else if (event.origin === "https://player.videasy.net") {
        let parsedOuter;
        if (typeof event.data === "string") {
          parsedOuter = JSON.parse(event.data);
        } else {
          parsedOuter = event.data;
        }

        const parsedData =
          typeof parsedOuter.data === "string"
            ? JSON.parse(parsedOuter.data)
            : parsedOuter.data;

        const key = `movie-${movie?.id}`;
        const currentMovie = parsedData?.[key];

        if (currentMovie?.progress) {
          watchedRef.current = currentMovie.progress.watched;
          durationRef.current = currentMovie.progress.duration;
          updateWatchedHistory(currentMovie);
        }
      } else {
        const savedHistory = JSON.parse(
          localStorage.getItem("WatchedHistory") || "{}",
        );
        const savedProgress = savedHistory?.[movie?.id]?.progress;

        if (savedProgress) {
          updateWatchedHistory(savedProgress);
        } else {
          updateWatchedHistory({
            watched: watchedRef.current,
            duration: durationRef.current,
          });
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [updateWatchedHistory, movie?.id, movie]);

  // Save progress when unmounting or server changes
  useEffect(() => {
    return () => {
      updateWatchedHistory({
        watched: watchedRef.current,
        duration: durationRef.current,
      });
    };
  }, [updateWatchedHistory]);

  const isLoading = movieLoading || genresLoading || movieTranslationsLoading;

  if (new Date(movie?.release_date) >= new Date()) return <ComingSoon />;
  if (isLoading) return <WatchMovieSkeleton />;

  return (
    <>
      <div className="min-h-screen absolute w-full 4xl:py-40 -z-10">
        <Image
          src={
            movie?.backdrop_path
              ? `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}${movie.backdrop_path}`
              : fallbackBg.src
          }
          alt={movie?.title || movie?.original_title || "background"}
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <PageSection className="xs:px-7 flex flex-col gap-16">
        <main className="flex flex-col gap-5">
          <Link
            href={`/details/${showType}/${showId}/${nameToSlug(getShowTitle({ isArabic, show: movie }) || movie?.original_title)}`}
            className="hover:underline w-fit"
          >
            <Title title={movie?.title || movie?.original_title} />
          </Link>

          <div className="flex items-center gap-2 flex-wrap">
            <FaStar className="text-yellow-500" title="Rating" />
            {movie?.vote_average?.toFixed(1)}
            <span className="text-gray-400">|</span>
            <FcCalendar title="Release Date" />
            {movie?.release_date}
            <span className="text-gray-400">|</span>
            <FcClock title="Duration" className="text-black" />
            {minutesToHours(movie?.runtime ?? 0, isArabic)}
            <span className="text-gray-400">|</span>
            <FaGlobeAmericas title="Language" />
            {movie?.original_language?.toUpperCase()}
          </div>

          {translatedGenres(movie)?.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {translatedGenres(movie).map((genre) => (
                <span
                  key={genre.id}
                  className="bg-gray-900 text-white px-1.5 rounded-md py-0.5 text-sm font-semibold"
                >
                  {genresLoading ? (
                    <CgSpinner className="animate-spin" />
                  ) : (
                    genre.genreName
                  )}
                </span>
              ))}
            </div>
          )}

          {finalOverview && (
            <div>
              <h3 className="font-bold text-xl">{t("Overview")}</h3>
              <p className="tracking-wide leading-loose text-gray-200">
                {finalOverview}
              </p>
            </div>
          )}
        </main>

        {cast.length > 0 && <Casts casts={cast} label={t("TopBilledCast")} />}

        <main ref={videoPlayerRef} className="flex flex-col gap-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-yellow-300 text-lg underline">
              {t("ServersWarning")}
            </p>
            <SelectComp
              items={serverOptions}
              setActiveSelect={setActiveServer}
              activeSelect={activeServer}
              label={t("Servers")}
            />
          </div>

          <iframe
            loading="lazy"
            src={
              getMovieWatchServers({ server: activeServer.query, showId })?.url
            }
            allowFullScreen
            style={{ overflow: "hidden" }}
            width="100%"
            className="aspect-video shadow-blueGlow rounded-md"
            title={movie?.title || movie?.original_title || "movie"}
          />
        </main>

        <LazyRender
          persistKey={`collection-${movie?.id}-movie`}
          Component={MovieCollectionBanner}
          props={{ movie }}
          loading={<SkeletonMovieCollectionBanner />}
        />

        <div className="flex flex-col gap-6">
          <LazyRender
            persistKey={`recommendations-${movie?.id}-movie`}
            Component={CardsSlider}
            props={{
              theShows: recommendations,
              showType,
              sliderType: "movies",
              className: "mt-10",
              title: t("Recommendations"),
            }}
            loading={
              <CardsSkeletonSlider arrLength={recommendations?.length} />
            }
          />
          <LazyRender
            persistKey={`similar-${movie?.id}-movie`}
            Component={CardsSlider}
            props={{
              theShows: similarMovies,
              showType,
              sliderType: "movies",
              className: "mt-10",
              title: t("Similar"),
            }}
            loading={<CardsSkeletonSlider arrLength={similarMovies?.length} />}
          />
        </div>
      </PageSection>
    </>
  );
};

export default WatchMovie;
