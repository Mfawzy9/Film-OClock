import { WatchHistoryItem } from "@/app/interfaces/localInterfaces/watchHistoryInterfaces";
import { IoMdCloseCircle } from "@react-icons/all-files/io/IoMdCloseCircle";
import Link from "next/link";
import {
  secondsToHMS,
  minutesToHMS,
  minutesToHours,
  nameToSlug,
} from "../../../../../helpers/helpers";
import Image from "next/image";
import useIsArabic from "@/app/hooks/useIsArabic";
import { memo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import BgPlaceholder from "../../BgPlaceholder/BgPlaceholder";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";

interface props {
  show: WatchHistoryItem;
  t: any;
  deleteHistoryItem: (e: React.MouseEvent, id: number) => void;
}

const WatchHistoryCard = ({ show, t, deleteHistoryItem }: props) => {
  const { isArabic } = useIsArabic();
  const dispatch = useDispatch();
  const isImgLoaded = useSelector(
    (state: RootState) =>
      state.imgPlaceholderReducer.loadedImgs[show.backdropPath],
    shallowEqual,
  );

  const hrefLink = ({ show }: { show: WatchHistoryItem }) => {
    if (show.showType === "tv") {
      return `/watch/tv/${show.id}/${nameToSlug(show.title)}?season=${show.season}&episode=${show.episode}`;
    } else {
      return `/watch/movie/${show.id}/${nameToSlug(show.title)}`;
    }
  };

  return (
    <div
      className="relative w-52 flex-none bg-gray-900 rounded-md border border-gray-700
        lg:hover:shadow-blueGlow lg:hover:shadow-blue-700/70"
    >
      {/* delete button */}
      <button
        onClick={(e) => deleteHistoryItem(e, show.id)}
        className="absolute top-0 right-0 z-20 text-white bg-black rounded-full text-2xl
          hover:text-blue-500"
      >
        <IoMdCloseCircle />
      </button>
      <Link href={hrefLink({ show })} className="relative">
        {/* bg */}
        <div className="relative rounded-md overflow-hidden">
          {!isImgLoaded && <BgPlaceholder />}
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${show.backdropPath}`}
            width={208}
            height={130}
            alt={show.title}
            className={`${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
              transition-[transform,opacity] duration-300 transform-gpu ease-out`}
            priority
            onLoad={() => dispatch(setImageLoaded(show.backdropPath))}
          />
          {/* layer */}
          <div
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/80
              via-transparent to-black/80"
          />
          {/* title */}
          <h2 className="absolute z-10 font-bold bottom-0 left-2 line-clamp-1">
            {show.title}
          </h2>
          {/* episode & season */}
          {show.season && show.episode && (
            <span className="absolute z-10 top-1 left-1 text-gray-300 bg-black/50 px-1 rounded-lg text-sm">
              {t("WatchHistorySliderSeason")}
              {show.season}
              {t("WatchHistorySliderEpisode")}
              {show.episode}
            </span>
          )}
        </div>
        {/* details */}
        <div className="flex flex-col mt-2 gap-1.5 px-2 pb-1">
          {/* progress bar */}
          <div className="bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-52">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${show.progress.percentage}%` }}
            />
          </div>
          {/* start time & end time */}
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {secondsToHMS(show?.progress?.watched)}
            </span>
            <span className="text-xs text-gray-400">
              {secondsToHMS(show?.progress?.duration) === "00:00:00"
                ? minutesToHMS(
                    (show.movieRuntime ?? 0) || (show.episodeRuntime ?? 0),
                  )
                : secondsToHMS(show?.progress?.duration)}
            </span>
          </div>
          {/* time */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              {minutesToHours(
                (show.movieRuntime ?? 0) || (show.episodeRuntime ?? 0),
                isArabic,
              )}
            </span>
            <span>{show.watchedAt}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default memo(WatchHistoryCard);
