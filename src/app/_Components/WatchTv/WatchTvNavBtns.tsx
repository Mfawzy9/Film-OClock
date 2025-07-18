import {
  Episode,
  TvSeasonDetailsResponse,
} from "@/app/interfaces/apiInterfaces/tvSeasonsDetailsInterfaces";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { nameToSlug } from "../../../../helpers/helpers";

interface WatchTvNavBtnsProps {
  seasonData: TvSeasonDetailsResponse;
  showId: number;
  season: number;
  episode: number;
  disableButtons: boolean;
  onWatchClick: () => void;
  tvShowName: string;
  nextEpisode: Episode | null;
}

const WatchTvNavBtns = ({
  seasonData,
  showId,
  season,
  episode,
  disableButtons,
  onWatchClick,
  tvShowName,
  nextEpisode,
}: WatchTvNavBtnsProps) => {
  const t = useTranslations("WatchTv");
  const totalEpisodes = seasonData?.episodes?.length || 0;
  const isNextEpisodeReleased =
    nextEpisode?.air_date && new Date(nextEpisode?.air_date) <= new Date();
  const [disablePrev, disableNext] = useMemo(
    () => [
      episode <= 1 || disableButtons,
      episode >= totalEpisodes || disableButtons || !isNextEpisodeReleased,
    ],
    [episode, totalEpisodes, disableButtons, isNextEpisodeReleased],
  );

  if (!seasonData) return null;
  return (
    <>
      {console.log(nextEpisode?.air_date)}
      <div className="flex items-center flex-wrap justify-between">
        {/* Previous Episode Button with tooltip */}
        <div className="relative group">
          <Link
            onClick={(e) => {
              if (disablePrev) {
                e.preventDefault();
                return;
              }
              onWatchClick?.();
            }}
            scroll={false}
            href={
              !disablePrev
                ? `/watch/tv/${showId}/${nameToSlug(tvShowName)}?season=${season}&episode=${episode - 1}`
                : "#"
            }
            className={`${
              disablePrev
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
              } px-2 py-1 xs:px-4 xs:py-2 bg-blue-600 text-white rounded transition-colors`}
            aria-disabled={disablePrev}
          >
            {t("PreviousEpisode")}
          </Link>
          {disablePrev && (
            <span
              className="absolute hidden group-hover:block -top-8 left-1/2 transform -translate-x-1/2
                bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
            >
              {episode <= 1 ? t("FirstEpisode") : "Loading..."}
            </span>
          )}
        </div>

        {/* Next Episode Button with tooltip */}
        <div className="relative group">
          <Link
            onClick={(e) => {
              if (disableNext) {
                e.preventDefault();
                return;
              }
              onWatchClick?.();
            }}
            scroll={false}
            href={
              !disableNext
                ? `/watch/tv/${showId}/${nameToSlug(tvShowName)}?season=${season}&episode=${episode + 1}`
                : "#"
            }
            className={`${
              disableNext
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
              } px-2 py-1 xs:px-4 xs:py-2 bg-blue-600 text-white rounded transition-colors`}
            aria-disabled={disableNext !== null ? disableNext : false}
          >
            {t("NextEpisode")}
          </Link>
          {disableNext && (
            <span
              className="absolute hidden group-hover:block -top-8 left-1/2 transform -translate-x-1/2
                bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
            >
              {episode >= totalEpisodes
                ? t("LastEpisode")
                : !isNextEpisodeReleased
                  ? t("Soon")
                  : "Loading..."}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default WatchTvNavBtns;
