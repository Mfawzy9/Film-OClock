"use client";
import { memo, useMemo } from "react";
import { useGetGenres } from "@/app/hooks/useGetGenres";
import WatchlistFavoriteDD from "../Library/WatchlistFavoriteDD/WatchlistFavoriteDD";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { Link } from "@/i18n/navigation";
import ScrollToSection from "../ScrollToSection/ScrollToSection";
import { WatchHistoryItem } from "@/app/interfaces/localInterfaces/watchHistoryInterfaces";
import { useLocale, useTranslations } from "next-intl";
import { useGetTranslationsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import Image from "next/image";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import { getShowTitle, nameToSlug } from "../../../../helpers/helpers";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import { FcCalendar } from "@react-icons/all-files/fc/FcCalendar";

interface ShortDetailsProps {
  title: string;
  description: string;
  rating: number;
  releaseDate: string;
  backdropPath: string;
  genresIds: number[];
  showType: "movie" | "tv";
  showId: number;
  theShow: Movie | TVShow | WatchHistoryItem;
  reference?: React.RefObject<HTMLDivElement | null>;
  scroll: boolean;
  className?: string;
  season?: number;
  episode?: number;
}

const ShortDetails = ({
  title,
  description,
  rating,
  releaseDate,
  backdropPath,
  genresIds,
  showType,
  showId,
  theShow,
  reference,
  scroll,
  className,
  episode,
  season,
}: ShortDetailsProps) => {
  const t = useTranslations("HomePage");
  const locale = useLocale();
  const { genres } = useGetGenres({ showType, lang: locale });
  const dispatch = useDispatch();
  const isImgLoaded = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs[backdropPath],
    shallowEqual,
  );

  const { data } = useGetTranslationsQuery(
    { showId, showType },
    { skip: locale !== "ar" },
  );

  const arabicOverview = useMemo(() => {
    const arabicSaOverview = data?.translations
      .find(
        (translation) =>
          translation.iso_639_1 === "ar" && translation.iso_3166_1 === "SA",
      )
      ?.data?.overview.trim();
    const arabicAeOverview = data?.translations
      .find(
        (translation) =>
          translation.iso_639_1 === "ar" && translation.iso_3166_1 === "AE",
      )
      ?.data?.overview.trim();
    return arabicSaOverview || arabicAeOverview;
  }, [data]);

  return (
    <main
      className={`px-2 max-w-screen-2xl mx-auto z-10 rounded-md ${className ?? ""}`}
    >
      <div className="relative">
        <WatchlistFavoriteDD
          showId={showId}
          showType={showType}
          theShow={theShow}
          episode={episode}
          season={season}
        />

        <Link
          href={`/details/${showType}/${showId}/${nameToSlug(getShowTitle({ show: theShow, isArabic: locale === "ar" }) ?? title)}`}
          className="relative flex items-end min-h-[30vh] sm:min-h-[40vh] md:min-h-[60vh]
            xl:min-h-[70vh] 2xl:min-h-[75vh] 3xl:min-h-[70vh] 4xl:min-h-[560px] px-2 sm:px-3
            pb-2 rounded-md border-2 border-gray-700 overflow-hidden group transition-all
            duration-300"
        >
          {/* episode & season  */}
          {episode && season && (
            <span className="absolute z-10 top-1 start-1 text-gray-300 bg-black/50 px-1 rounded-lg text-sm">
              {t("LastWatchedSeason")} {season} {t("LastWatchedEpisode")}{" "}
              {episode}
            </span>
          )}

          {/* Background Image via <Image /> */}
          {!isImgLoaded && <BgPlaceholder />}

          <Image
            src={backdropPath}
            alt={title}
            fill
            priority
            className={`object-cover object-center transition-[transform,opacity] transform-gpu
              duration-[2000ms]
              ${isImgLoaded ? "opacity-100 scale-100 " : "opacity-0 scale-90 "}
              lg:group-hover:scale-125 z-0`}
            onLoad={() => dispatch(setImageLoaded(backdropPath))}
          />

          {/* Gradient overlay */}
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/90 from-15% via-transparent
              to-black/90 z-1"
          />

          {/* Content */}
          <div className="flex flex-col gap-1 sm:gap-2 relative z-10 w-full">
            <h1 className="font-bold sm:text-3xl">{title}</h1>
            <p className="text-sm sm:leading-relaxed text-gray-300 line-clamp-2 max-w-xl">
              {locale === "ar" ? (arabicOverview ?? description) : description}
            </p>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <h6 className="flex items-center gap-1 text-xs text-gray-300">
                  <FcCalendar /> {releaseDate?.split("-")[0]}
                </h6>
                <h6 className="flex items-center gap-1 text-xs text-gray-300">
                  <FaStar className="text-yellow-500" title="Rating" />
                  {rating?.toFixed(1)}
                </h6>
              </div>
              {genresIds && genresIds.length > 0 && (
                <p className="text-xs text-gray-300 line-clamp-1 relative z-10">
                  {genres(genresIds)?.join(", ")}
                </p>
              )}
            </div>
          </div>
        </Link>

        {scroll && reference && (
          <ScrollToSection
            className="hidden md:block !-bottom-16 xl:!bottom-0"
            reference={reference}
          />
        )}
      </div>
    </main>
  );
};

export default memo(ShortDetails);
