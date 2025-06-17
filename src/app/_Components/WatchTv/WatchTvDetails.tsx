import { minutesToHours } from "../../../../helpers/helpers";
import {
  Episode,
  TvDetailsResponse,
} from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import Title from "../Title/Title";
import { useMemo } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useGetGenres } from "@/app/hooks/useGetGenres";
import { useGetEpisodeTranslationsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { FaGlobeAmericas } from "@react-icons/all-files/fa/FaGlobeAmericas";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import { FcCalendar } from "@react-icons/all-files/fc/FcCalendar";
import { FcClock } from "@react-icons/all-files/fc/FcClock";
import dynamic from "next/dynamic";
import { TvTranslationsResponse } from "@/app/interfaces/apiInterfaces/translationsInterfaces";

const OverviewSkeleton = dynamic(
  () => import("../OverviewSkeleton/OverviewSkeleton"),
);

interface WatchTvDetailsProps {
  tvShow: TvDetailsResponse;
  currentEpisode: Episode | null;
  season: number;
  episode: number;
  tvLink: string;
  isArabic: boolean;
  tvShowTranslations: TvTranslationsResponse;
}

const WatchTvDetails = ({
  tvShow,
  currentEpisode,
  season,
  episode,
  tvLink,
  isArabic,
  tvShowTranslations,
}: WatchTvDetailsProps) => {
  const t = useTranslations("WatchTv");

  //get translated genres
  const { genresLoading, translatedGenres } = useGetGenres({
    showType: "tv",
    lang: isArabic ? "ar" : "en",
    isDetailsPage: true,
  });

  const finalGenres = useMemo(
    () => (isArabic ? translatedGenres(tvShow) : tvShow?.genres),
    [tvShow, translatedGenres, isArabic],
  );

  const { data: episodeTranslations, isLoading: episodeTranslationsLoading } =
    useGetEpisodeTranslationsQuery(
      {
        eNumber: episode,
        sNumber: season,
        showId: tvShow?.id,
        episodeId: currentEpisode?.id ?? 0,
      },
      { skip: !isArabic || !currentEpisode },
    );

  const arabicEpisodeOverviewTranslation = useMemo(() => {
    const arabicAeEpisodeOverviewTranslation = episodeTranslations?.translations
      .find(
        (translation) =>
          translation.iso_639_1 === "ar" && translation.iso_3166_1 === "AE",
      )
      ?.data?.overview.trim();
    const arabicSaEpisodeOverviewTranslation = episodeTranslations?.translations
      .find(
        (translation) =>
          translation.iso_639_1 === "ar" && translation.iso_3166_1 === "SA",
      )
      ?.data?.overview.trim();
    if (arabicAeEpisodeOverviewTranslation)
      return arabicAeEpisodeOverviewTranslation;
    if (arabicSaEpisodeOverviewTranslation)
      return arabicSaEpisodeOverviewTranslation;
  }, [episodeTranslations]);

  const arabicTvShowOverviewTranslation = useMemo(() => {
    const arabicAeTvShowOverviewTranslation = tvShowTranslations?.translations
      .find(
        (translation) =>
          translation.iso_639_1 === "ar" && translation.iso_3166_1 === "AE",
      )
      ?.data?.overview.trim();
    const arabicSaTvShowOverviewTranslation = tvShowTranslations?.translations
      .find(
        (translation) =>
          translation.iso_639_1 === "ar" && translation.iso_3166_1 === "SA",
      )
      ?.data?.overview.trim();
    if (arabicAeTvShowOverviewTranslation)
      return arabicAeTvShowOverviewTranslation;
    if (arabicSaTvShowOverviewTranslation)
      return arabicSaTvShowOverviewTranslation;
  }, [tvShowTranslations]);

  const finalOverview = useMemo(() => {
    return isArabic
      ? (arabicEpisodeOverviewTranslation ??
          arabicTvShowOverviewTranslation ??
          "")
      : (currentEpisode?.overview ?? tvShow?.overview ?? "");
  }, [
    isArabic,
    arabicEpisodeOverviewTranslation,
    arabicTvShowOverviewTranslation,
    currentEpisode,
    tvShow?.overview,
  ]);

  if (!tvShow || !currentEpisode) {
    return null;
  }
  return (
    <>
      <main className="flex flex-col gap-5">
        <Link href={tvLink} className="hover:underline w-fit">
          <Title
            title={
              (isArabic && tvShow?.original_language === "ar"
                ? tvShow?.original_name
                : tvShow?.name) +
                ` | ${t("Season")} ` +
                season +
                ` | ${t("Episode")} ` +
                episode || ""
            }
          />
        </Link>
        <h6 className="flex items-center gap-2 flex-wrap">
          <FaStar className="text-yellow-500" title="Rating" />
          {currentEpisode?.vote_average.toFixed(1) === "0.0"
            ? tvShow?.vote_average.toFixed(1)
            : currentEpisode?.vote_average.toFixed(1)}
          <span className="text-gray-400">|</span>
          <FcCalendar title="Last Date" />
          {currentEpisode?.air_date && currentEpisode?.air_date}
          <span className="text-gray-400">|</span>
          <FcClock title="Duration" className="text-black" />{" "}
          {minutesToHours(currentEpisode?.runtime ?? 0, isArabic)}
          <span className="text-gray-400">|</span>
          <FaGlobeAmericas title="Language" />
          {tvShow?.original_language.toUpperCase()}
        </h6>

        {finalGenres?.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {finalGenres?.map((genre, idx) => (
              <span
                key={idx}
                className="bg-gray-900 text-white px-1.5 rounded-md py-0.5 text-sm font-semibold"
              >
                {genresLoading ? (
                  <span className="animate-pulse w-14 h-6 bg-gray-700 rounded-md block" />
                ) : "genreName" in genre ? (
                  genre.genreName
                ) : (
                  genre.name
                )}
              </span>
            ))}
          </div>
        )}
        {/* overview */}
        {episodeTranslationsLoading ? (
          <OverviewSkeleton />
        ) : (
          finalOverview && (
            <div>
              <h3 className="font-bold text-xl">{t("Overview")}</h3>
              <p className="tracking-wide leading-loose text-gray-200">
                {finalOverview}
              </p>
            </div>
          )
        )}
      </main>
    </>
  );
};

export default WatchTvDetails;
