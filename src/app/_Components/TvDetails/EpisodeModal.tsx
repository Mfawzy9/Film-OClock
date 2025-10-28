import { motion } from "framer-motion";
import Image from "next/image";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { RootState, AppDispatch } from "@/lib/Redux/store";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { Episode } from "@/app/interfaces/apiInterfaces/tvSeasonsDetailsInterfaces";
import { minutesToHours, nameToSlug } from "../../../../helpers/helpers";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import useIsArabic from "@/app/hooks/useIsArabic";
import { useMemo } from "react";
import { useGetEpisodeTranslationsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { CgSpinner } from "@react-icons/all-files/cg/CgSpinner";
import { FaRegPlayCircle } from "@react-icons/all-files/fa/FaRegPlayCircle";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import { FcCalendar } from "@react-icons/all-files/fc/FcCalendar";
import { FcClock } from "@react-icons/all-files/fc/FcClock";

interface EpisodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  episode: Episode | null;
  showId: number;
  seasonNumber: number;
  episodeNumber: number;
  onWatchClick?: () => void;
  episodeId: number;
  tvShowName: string;
  isReleased: boolean;
}

const EpisodeModal = ({
  isOpen,
  onClose,
  episode,
  showId,
  seasonNumber,
  episodeNumber,
  onWatchClick,
  episodeId,
  tvShowName,
  isReleased,
}: EpisodeModalProps) => {
  const { isArabic } = useIsArabic();
  const t = useTranslations("TvDetails");
  const dispatch = useDispatch<AppDispatch>();

  const isImgLoaded = useSelector(
    (state: RootState) =>
      state.imgPlaceholderReducer.loadedImgs[episode?.still_path ?? ""] ||
      false,
    shallowEqual,
  );

  const { data: episodeTranslations, isLoading: translationsLoading } =
    useGetEpisodeTranslationsQuery(
      {
        showId,
        eNumber: episodeNumber || 1,
        sNumber: seasonNumber,
        episodeId,
      },
      {
        skip: !isArabic || !showId,
      },
    );

  const arabicTranslation = useMemo(() => {
    if (episodeTranslations) {
      return episodeTranslations?.translations?.find(
        (translation) => translation.iso_639_1 === "ar",
      );
    }
    return null;
  }, [episodeTranslations]);

  if (!isOpen || !episode) return null;
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 z-50 xs:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-gray-950 text-white p-6 rounded-lg shadow-lg w-full max-w-lg
          3xl:max-w-3xl max-h-[100vh] xs:max-h-[auto] overflow-y-auto xs:overflow-hidden
          sm:max-w-xl md:max-w-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute z-40 top-3 right-4 text-xl bg-black rounded-full p-2 hover:bg-gray-700"
        >
          ✖
        </button>

        {/* Responsive Image with Loading Placeholder */}
        <div
          className="relative flex justify-center items-center w-full h-40 sm:h-56 md:h-64 lg:h-72
            rounded-lg overflow-hidden"
        >
          {!isImgLoaded && <BgPlaceholder />}
          {episode.still_path !== null && episode.still_path ? (
            <>
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_ORI}${episode.still_path}`}
                alt={episode.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 75vw, 50vw"
                className={`object-cover ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                  transition-[transform,opacity] duration-300 transform-gpu ease-out`}
                priority
                onLoad={() => dispatch(setImageLoaded(episode.still_path))}
              />
            </>
          ) : (
            <>
              <h3
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-bold text-white
                  z-30"
              >
                {t("Tabs.EpisodeCard.NoImage")}
              </h3>
              <BgPlaceholder />
            </>
          )}
        </div>

        {/* Episode Details */}
        <div className="mt-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h6 className="flex items-center gap-2 flex-wrap">
              <FaStar className="text-yellow-500" title="Rating" />
              {episode?.vote_average.toFixed(1)}
              <span className="text-gray-400">|</span>
              <FcCalendar title="Air Date" />
              {episode?.air_date && episode?.air_date}
              <FcClock title="Duration" className="text-black" />
              {minutesToHours(episode?.runtime ?? 0, isArabic)}
            </h6>
            {isReleased && (
              <Link
                scroll={false}
                onClick={() => {
                  onWatchClick?.();
                  onClose();
                }}
                href={`/watch/tv/${showId}/${nameToSlug(tvShowName)}?season=${seasonNumber}&episode=${episodeNumber}`}
                className="rounded-lg mt-2 bg-blue-800 py-3 px-6 text-center align-middle text-sm font-bold
                  text-white shadow-md shadow-blue-500/20 transition-all lg:hover:shadow-lg
                  lg:hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none
                  active:opacity-[0.85] active:shadow-none flex items-center gap-1 justify-center"
              >
                <FaRegPlayCircle className="text-2xl" />{" "}
                {t("Tabs.EpisodeModal.WatchEpisode")}
              </Link>
            )}
          </div>
          <h6 className="flex items-center gap-2 flex-wrap mt-2">
            {t("Tabs.EpisodeModal.Episode")} {episode?.episode_number} |{" "}
            {t("Tabs.EpisodeModal.Season")} {episode?.season_number}
          </h6>
          <h2 className="mt-4 text-lg sm:text-xl font-bold text-blue-300">
            {episode.name}
          </h2>
          <p className="mt-2 text-gray-300 text-sm sm:text-base overflow-auto max-h-96">
            {translationsLoading ? (
              <span className="flex items-center gap-2">
                <CgSpinner className="animate-spin" />{" "}
                {t("Tabs.EpisodeCard.Loading")}
              </span>
            ) : (
              arabicTranslation?.data.overview || episode.overview
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EpisodeModal;
