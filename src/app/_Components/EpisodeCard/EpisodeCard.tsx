import { memo, useMemo } from "react";
import Image from "next/image";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { RootState, AppDispatch } from "@/lib/Redux/store";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useGetEpisodeTranslationsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import useIsArabic from "@/app/hooks/useIsArabic";
import { nameToSlug } from "../../../../helpers/helpers";
import { TVShow } from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { CgSpinner } from "@react-icons/all-files/cg/CgSpinner";
import { FaRegPlayCircle } from "@react-icons/all-files/fa/FaRegPlayCircle";

interface EpisodeCardProps {
  img: string;
  title: string;
  description: string;
  episodeNumber?: number;
  onReadMore: () => void;
  seasonNumber: number;
  showId: number;
  onWatchClick?: (e: React.MouseEvent) => void;
  episodeId: number;
  tvShowName: string;
  tvShow: TVShow;
}

const EpisodeCard = ({
  img,
  title,
  description,
  onReadMore,
  episodeNumber,
  seasonNumber,
  showId,
  episodeId,
  onWatchClick,
  tvShowName,
  tvShow,
}: EpisodeCardProps) => {
  const { isArabic } = useIsArabic();
  const t = useTranslations("TvDetails");
  const dispatch = useDispatch<AppDispatch>();
  const isImgLoaded = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs[img],
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
      return episodeTranslations.translations.find(
        (translation) => translation.iso_639_1 === "ar",
      );
    }
    return null;
  }, [episodeTranslations]);

  return (
    <div
      onClick={onReadMore}
      className="relative flex flex-col rounded-xl bg-gradient-to-br from-black to-gray-800
        shadow-blue-700 text-gray-700 shadow lg:hover:shadow-md lg:hover:shadow-blue-500
        cursor-pointer transition-all duration-200 hover:-translate-y-1 min-w-64
        xs:min-w-[unset]"
    >
      <div className="relative mx-4 -mt-6 h-40 overflow-hidden rounded-xl shadow shadow-blue-700">
        {!isImgLoaded && <BgPlaceholder />}
        {img !== "" ? (
          <Image
            src={img}
            alt={title}
            fill
            sizes="100%"
            className={`object-cover ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
              transition-[transform,opacity] duration-300 transform-gpu ease-out`}
            onLoad={() => dispatch(setImageLoaded(img))}
          />
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
      <div className="p-6">
        <h4 className="text-lg font-semibold text-gray-200">
          {t("Tabs.EpisodeCard.TheEpisode")} {episodeNumber}
        </h4>
        <h5 className="mb-2 text-xl font-semibold text-blue-300 line-clamp-1">
          {title}
        </h5>

        <p className="text-base font-light text-gray-200 line-clamp-3 tracking-wide">
          {translationsLoading ? (
            <span className="flex items-center gap-2">
              <CgSpinner className="animate-spin" />{" "}
              {t("Tabs.EpisodeCard.Loading")}
            </span>
          ) : (
            arabicTranslation?.data?.overview || description
          )}
        </p>
      </div>
      <div className="p-6 pt-0 flex justify-between flex-wrap gap-3">
        <button
          onClick={onReadMore}
          className="rounded-lg bg-blue-700 py-3 px-6 text-center align-middle text-xs font-bold
            uppercase text-white shadow-md shadow-blue-500/20 transition-all
            lg:hover:shadow-lg lg:hover:shadow-blue-500/40 focus:opacity-[0.85]
            focus:shadow-none active:opacity-[0.85] active:shadow-none grow"
        >
          {t("Tabs.EpisodeCard.ReadMore")}
        </button>
        {new Date(tvShow?.first_air_date) <= new Date() && (
          <Link
            scroll={false}
            onClick={(e) => {
              e.stopPropagation();
              if (onWatchClick) onWatchClick(e);
            }}
            href={`/watch/tv/${showId}/${nameToSlug(tvShowName)}?season=${seasonNumber}&episode=${episodeNumber}`}
            className="rounded-lg bg-teal-800 py-3 px-6 text-center align-middle text-xs font-bold
              uppercase text-white shadow-md shadow-teal-500/20 transition-all
              lg:hover:shadow-lg lg:hover:shadow-teal-500/40 focus:opacity-[0.85]
              focus:shadow-none active:opacity-[0.85] active:shadow-none flex items-center
              gap-1 grow justify-center"
          >
            <FaRegPlayCircle className="text-lg" />{" "}
            {t("Tabs.EpisodeCard.Watch")}
          </Link>
        )}
      </div>
    </div>
  );
};

export default memo(EpisodeCard);
