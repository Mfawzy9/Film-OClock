"use client";

import tmdbApi, {
  useGetMTDetailsQuery,
  useGetTvSeasonDetailsQuery,
} from "@/lib/Redux/apiSlices/tmdbSlice";
import { useEffect, useMemo, useRef, useCallback } from "react";
import Title from "../Title/Title";
import { TvDetailsResponse } from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import PageSection from "../PageSection/PageSection";
import MainLoader from "../MainLoader/MainLoader";
import Casts from "../Casts/Casts";
import WatchTvDetails from "./WatchTvDetails";
import WatchTvBg from "./WatchTvBg";
import WatchTvPlayer from "./WatchTvPlayer";
import WatchTvNavBtns from "./WatchTvNavBtns";
import { TvSeasonDetailsResponse } from "@/app/interfaces/apiInterfaces/tvSeasonsDetailsInterfaces";
import { TVShow } from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { WatchedTvShowHistoryItem } from "@/app/interfaces/localInterfaces/watchHistoryInterfaces";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/Redux/store";
import { TvTranslationsResponse } from "@/app/interfaces/apiInterfaces/translationsInterfaces";
import { nameToSlug } from "../../../../helpers/helpers";

const CardsSlider = dynamic(() => import("../CardsSlider/CardsSlider"));
const TvEpisodes = dynamic(() => import("../TvDetails/TvEpisodes"));

interface WatchTvProps {
  showType: "movie" | "tv";
  showId: number;
  season: number;
  episode: number;
  initialData: TvDetailsResponse | null;
  initialTranslations: TvTranslationsResponse | null;
}

interface ProgressData {
  watched: number;
  duration: number;
}

const WatchTv = ({
  showType,
  showId,
  season,
  episode,
  initialData,
  initialTranslations,
}: WatchTvProps) => {
  const t = useTranslations("WatchTv");
  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const watchedRef = useRef(0);
  const durationRef = useRef(0);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (initialData) {
      dispatch(
        tmdbApi.util.upsertQueryData(
          "getMTDetails",
          { showId, showType },
          initialData,
        ),
      );
    }
  }, [dispatch, initialData, showId, showType]);

  useEffect(() => {
    if (initialTranslations) {
      dispatch(
        tmdbApi.util.upsertQueryData(
          "getTranslations",
          { showId, showType },
          initialTranslations,
        ),
      );
    }
  }, [dispatch, initialTranslations, showId, showType]);

  const {
    data: tvShow,
    isLoading: tvShowLoading,
    isFetching: tvShowFetching,
  } = useGetMTDetailsQuery({ showType, showId }, { skip: !showId }) as {
    data: TvDetailsResponse;
    isLoading: boolean;
    isFetching: boolean;
  };

  const {
    data: seasonData,
    isLoading: seasonLoading,
    isFetching: seasonFetching,
  } = useGetTvSeasonDetailsQuery(
    { tvShowId: showId, seasonNumber: season },
    { skip: !showId || !season },
  );

  // Load saved progress when component mounts or episode changes
  useEffect(() => {
    if (!tvShow) return;

    const savedHistory = JSON.parse(
      localStorage.getItem("WatchedHistory") || "{}",
    );
    const savedProgress = savedHistory[tvShow.id]?.progress;

    if (
      savedProgress &&
      savedProgress.season === season &&
      savedProgress.episode === episode
    ) {
      durationRef.current = savedProgress.duration || 0;
      watchedRef.current = savedProgress.watched || 0;
    } else {
      durationRef.current = 0;
      watchedRef.current = 0;
    }
  }, [tvShow, season, episode]);

  // Derived states
  const isLoading = tvShowLoading || seasonLoading;
  const isFetchingAny = tvShowFetching || seasonFetching;
  const disableButtons = isLoading || isFetchingAny;

  const guestStars = useMemo(
    () => seasonData?.episodes[episode - 1]?.guest_stars ?? [],
    [seasonData?.episodes, episode],
  );

  const currentEpisode = useMemo(
    () => seasonData?.episodes?.[episode - 1] ?? null,
    [seasonData?.episodes, episode],
  );

  const recommendations = useMemo(
    () => (tvShow?.recommendations?.results as TVShow[]) ?? [],
    [tvShow?.recommendations?.results],
  );

  const similarShows = useMemo(
    () => (tvShow?.similar?.results as TVShow[]) ?? [],
    [tvShow?.similar?.results],
  );

  const seasonsCount = useMemo(
    () => tvShow?.number_of_seasons ?? tvShow?.seasons?.length - 1 ?? 1,
    [tvShow?.number_of_seasons, tvShow?.seasons],
  );

  // Memoized update function
  const updateWatchedHistory = useCallback(
    (progressData: ProgressData) => {
      if (!tvShow || !currentEpisode) return;

      const now = new Date();
      const duration = progressData.duration || durationRef.current;
      const watched = progressData.watched || watchedRef.current;

      // Update refs
      durationRef.current = duration;
      watchedRef.current = watched;

      const data: WatchedTvShowHistoryItem = {
        id: tvShow.id,
        showType: "tv",
        title: tvShow.original_name,
        overview: tvShow.overview,
        episodeOverview: currentEpisode.overview,
        posterPath: tvShow.poster_path,
        backdropPath: tvShow.backdrop_path,
        season,
        episode,
        episodeRuntime: currentEpisode?.runtime || 0,
        progress: {
          watched,
          duration,
          percentage:
            duration > 0 ? Math.min((watched / duration) * 100, 100) : 0,
        },
        watchedAt: now.toLocaleDateString(),
        watchedTime: now.toLocaleTimeString(),
        watchedCount: 1,
        releaseDate: currentEpisode?.air_date ?? null,
        rating: tvShow?.vote_average,
        genresIds: tvShow?.genres?.map((genre) => genre.id) || [],
      };

      const prevHistory = JSON.parse(
        localStorage.getItem("WatchedHistory") || "{}",
      );
      localStorage.setItem(
        "WatchedHistory",
        JSON.stringify({ ...prevHistory, [tvShow.id]: data }),
      );
    },
    [tvShow, season, episode, currentEpisode],
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
        (event.origin === "https://vidlink.pro" ||
          event.origin === "https://www.vidsrc.wtf") &&
        event.data?.type === "MEDIA_DATA"
      ) {
        const mediaData = event.data.data;
        const key = `s${season}e${episode}`;
        const episodeProgress =
          mediaData[tvShow?.id]?.show_progress?.[key]?.progress;
        if (episodeProgress) {
          watchedRef.current = episodeProgress.watched;
          durationRef.current = episodeProgress.duration;
          updateWatchedHistory(episodeProgress);
        }
      } else if (
        event.origin === "https://vidjoy.pro" &&
        event.data?.type === "MEDIA_DATA"
      ) {
        const progress = event?.data[tvShow?.id]?.progress;
        if (progress) {
          watchedRef.current = progress.watched;
          durationRef.current = progress.duration;
          updateWatchedHistory(progress);
        }
      } else if (
        event.origin === "https://vidfast.pro" &&
        event.data?.type === "MEDIA_DATA"
      ) {
        const mediaData = event.data.data;
        const key = `s${season}e${episode}`;
        const episodeProgress =
          mediaData[`t${tvShow?.id}`]?.show_progress?.[key]?.progress;
        if (episodeProgress) {
          watchedRef.current = episodeProgress.watched;
          durationRef.current = episodeProgress.duration;
          updateWatchedHistory(episodeProgress);
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

        const key = `tv-${tvShow?.id}`;
        const currentTvShow = parsedData?.[key];

        if (currentTvShow?.progress) {
          watchedRef.current = currentTvShow.progress.watched;
          durationRef.current = currentTvShow.progress.duration;
          updateWatchedHistory(currentTvShow);
        }
      } else {
        const savedHistory = JSON.parse(
          localStorage.getItem("WatchedHistory") || "{}",
        );
        const savedProgress = savedHistory?.[tvShow?.id]?.progress;

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
  }, [updateWatchedHistory, tvShow?.id, season, episode]);

  // Handlers
  const scrollToPlayer = () => {
    videoPlayerRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) return <MainLoader />;
  if (!tvShow || !seasonData) return <div>Data not available</div>;

  const playerProps = {
    episode,
    season,
    showId,
    tvShow,
    disableButtons,
    totalEpisodes: seasonData.episodes?.length || 0,
  };

  return (
    <>
      <WatchTvBg backdropPath={tvShow.backdrop_path ?? ""} />

      <PageSection className="xs:px-7 flex flex-col gap-16">
        <WatchTvDetails
          tvLink={`/details/${showType}/${showId}/${nameToSlug(tvShow?.original_name)}`}
          currentEpisode={currentEpisode}
          tvShow={tvShow}
          episode={episode}
          season={season}
        />

        {guestStars.length > 0 && (
          <Casts casts={guestStars} label={t("GuestStars")} />
        )}

        <main ref={videoPlayerRef} className="flex flex-col gap-5">
          <WatchTvPlayer {...playerProps} />
          <WatchTvNavBtns
            disableButtons={disableButtons}
            onWatchClick={scrollToPlayer}
            seasonData={seasonData as TvSeasonDetailsResponse}
            showId={showId}
            season={season}
            episode={episode}
            tvShowName={tvShow?.original_name}
          />
        </main>

        <div>
          <Title title={t("TheEpisodes")} />
          <br />
          <TvEpisodes
            tvShowName={tvShow?.original_name}
            seasonsCount={seasonsCount}
            tvShowId={tvShow.id}
            onWatchClick={scrollToPlayer}
          />
        </div>

        <div className="flex flex-col gap-6">
          <CardsSlider
            theShows={recommendations}
            showType={showType}
            sliderType="tvShows"
            className="mt-10"
            title={t("Recommendations")}
          />
          <CardsSlider
            theShows={similarShows}
            showType={showType}
            sliderType="tvShows"
            className="mt-10"
            title={t("Similar")}
          />
        </div>
      </PageSection>
    </>
  );
};

export default WatchTv;

// "use client";

// import {
//   useGetMTDetailsQuery,
//   useGetTvSeasonDetailsQuery,
// } from "@/lib/Redux/apiSlices/tmdbSlice";
// import { useEffect, useMemo, useRef } from "react";
// import Title from "../Title/Title";
// import { TvDetailsResponse } from "@/app/interfaces/apiInterfaces/detailsInterfaces";
// import PageSection from "../PageSection/PageSection";
// import MainLoader from "../MainLoader/MainLoader";
// import TvEpisodes from "../TvDetails/TvEpisodes";
// import Casts from "../Casts/Casts";
// import CardsSlider from "../CardsSlider/CardsSlider";
// import WatchTvDetails from "./WatchTvDetails";
// import WatchTvBg from "./WatchTvBg";
// import WatchTvPlayer from "./WatchTvPlayer";
// import WatchTvNavBtns from "./WatchTvNavBtns";
// import { TvSeasonDetailsResponse } from "@/app/interfaces/apiInterfaces/tvSeasonsDetailsInterfaces";
// import { TVShow } from "@/app/interfaces/apiInterfaces/discoverInterfaces";

// interface WatchTvProps {
//   showType: "movie" | "tv";
//   showId: number;
//   season: number;
//   episode: number;
// }

// const WatchTv = ({ showType, showId, season, episode }: WatchTvProps) => {
//   // Get TV show data
//   const {
//     data,
//     isLoading: tvShowLoading,
//     isFetching,
//   } = useGetMTDetailsQuery(
//     {
//       showType,
//       showId,
//     },
//     { skip: !showId },
//   );
//   const tvShow = data as TvDetailsResponse;

//   // Player container ref
//   const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

//   // Get season data
//   const {
//     data: seasonData,
//     isLoading: seasonLoading,
//     isFetching: seasonFetching,
//   } = useGetTvSeasonDetailsQuery(
//     {
//       tvShowId: showId,
//       seasonNumber: season,
//     },
//     { skip: !showId || !season },
//   );

//   const isLoading = tvShowLoading || seasonLoading;
//   const disableButtons = isLoading || isFetching || seasonFetching;

//   // Get guest stars
//   const guestStars = useMemo(
//     () => seasonData?.episodes[episode - 1]?.guest_stars || [],
//     [seasonData?.episodes, episode],
//   );

//   // Memoize the current episode data
//   const currentEpisode = useMemo(() => {
//     if (!seasonData?.episodes?.length) return null;
//     return seasonData.episodes[episode - 1];
//   }, [seasonData, episode]);

//   const onWatchClick = () => {
//     if (videoPlayerRef.current) {
//       videoPlayerRef.current.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   useEffect(() => {
//     const handleMessage = (event: MessageEvent) => {
//       if (event.origin !== "https://vidlink.pro") {
//         const now = new Date();
//         const currentDate = now.toLocaleDateString();
//         const currentTime = now.toLocaleTimeString();
//         const data = {
//           id: tvShow.id,
//           type: "tv",
//           title: tvShow.name,
//           posterPath: tvShow.poster_path,
//           backdropPath: tvShow.backdrop_path,
//           season,
//           episode,
//           progress: {
//             watched: 0,
//             duration: 0,
//             percentage: 0,
//           },
//           watchedAt: currentDate,
//           watchedTime: currentTime,
//           watchedCount: 1,
//           releaseDate: currentEpisode?.air_date ?? null,
//         };

//         const prev = JSON.parse(localStorage.getItem("WatchedHistory") || "{}");

//         const updated = {
//           ...prev,
//           [tvShow.id]: data,
//         };

//         localStorage.setItem("WatchedHistory", JSON.stringify(updated));

//         return;
//       }

//       if (event.data?.type === "MEDIA_DATA") {
//         const mediaData = event.data.data;
//         const key = `s${season}e${episode}`;
//         const episodeProgress =
//           mediaData[tvShow.id]?.show_progress?.[key]?.progress;

//         if (!episodeProgress) return;

//         const watched = episodeProgress.watched || 0;
//         const duration = episodeProgress.duration || 0;
//         const percentage =
//           duration > 0 ? Math.min((watched / duration) * 100, 100) : 0;

//         const now = new Date();
//         const currentDate = now.toLocaleDateString();
//         const currentTime = now.toLocaleTimeString();

//         const data = {
//           id: tvShow.id,
//           type: "tv",
//           title: tvShow.name,
//           posterPath: tvShow.poster_path,
//           backdropPath: tvShow.backdrop_path,
//           season,
//           episode,
//           progress: {
//             watched,
//             duration,
//             percentage,
//           },
//           watchedAt: currentDate,
//           watchedTime: currentTime,
//           watchedCount: 1,
//           releaseDate: currentEpisode?.air_date ?? null,
//         };

//         // const storageKey = `${tvShow.id}`;
//         const prev = JSON.parse(localStorage.getItem("WatchedHistory") || "{}");

//         const updated = {
//           ...prev,
//           [tvShow.id]: data,
//         };

//         localStorage.setItem("WatchedHistory", JSON.stringify(updated));
//       }
//     };

//     window.addEventListener("message", handleMessage);
//     return () => {
//       window.removeEventListener("message", handleMessage);
//     };
//   }, [tvShow, season, episode, currentEpisode]);

//   if (isLoading) return <MainLoader />;

//   return (
//     <>
//       <WatchTvBg backdropPath={data?.backdrop_path ?? ""} />
//       {/* episode details */}

//       <PageSection className="px-7 flex flex-col gap-16">
//         {/* details */}
//         <WatchTvDetails
//           tvLink={`/Details/${showType}/${showId}`}
//           currentEpisode={currentEpisode}
//           tvShow={tvShow}
//           episode={episode}
//           season={season}
//         />

//         {/* guests */}
//         {guestStars.length > 0 && (
//           <Casts casts={guestStars} label="Guest Stars" />
//         )}

//         {/* video player */}
//         <main ref={videoPlayerRef} className="flex flex-col gap-5">
//           <WatchTvPlayer
//             episode={episode}
//             season={season}
//             showId={showId}
//             tvShow={tvShow}
//             disableButtons={isLoading || isFetching || seasonFetching}
//             totalEpisodes={seasonData?.episodes?.length || 0}
//           />
//           {/* navigation buttons */}
//           <WatchTvNavBtns
//             disableButtons={disableButtons}
//             onWatchClick={onWatchClick}
//             seasonData={seasonData as TvSeasonDetailsResponse}
//             showId={showId}
//             season={season}
//             episode={episode}
//           />
//         </main>

//         {/* episodes */}
//         <div>
//           <Title title="Episodes" />
//           <br />
//           <TvEpisodes
//             seasonsCount={
//               tvShow?.number_of_seasons || tvShow?.seasons?.length - 1 || 1
//             }
//             tvShowId={tvShow?.id || 0}
//             onWatchClick={onWatchClick}
//           />
//         </div>

//         {/* similar */}
//         <div className="flex flex-col gap-6">
//           <CardsSlider
//             theShows={(tvShow?.recommendations?.results as TVShow[]) || []}
//             showType={showType}
//             sliderType="tvShows"
//             className="mt-10"
//             title="Recommendations"
//           />
//           <CardsSlider
//             theShows={(tvShow?.similar?.results as TVShow[]) || []}
//             showType={showType}
//             sliderType="tvShows"
//             className="mt-10"
//             title="Similar"
//           />
//         </div>
//       </PageSection>
//     </>
//   );
// };

// export default WatchTv;
