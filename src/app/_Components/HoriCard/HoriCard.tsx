import { useGetGenres } from "@/app/hooks/useGetGenres";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { memo, useMemo } from "react";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import WatchlistFavoriteDD from "../Library/WatchlistFavoriteDD/WatchlistFavoriteDD";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { useLocale } from "next-intl";
import { nameToSlug } from "../../../../helpers/helpers";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import { FcCalendar } from "@react-icons/all-files/fc/FcCalendar";

interface HoriCardProps {
  title: string;
  date: string;
  rating: number;
  backdrop_path: string;
  showId: number;
  showType: "movie" | "tv";
  genresIds: number[];
  idx: number;
  onHover: () => void;
  isActive: boolean;
  theShow: Movie | TVShow;
}

const HoriCard = ({
  backdrop_path,
  date,
  rating,
  showId,
  showType,
  title,
  genresIds,
  idx,
  onHover,
  isActive,
  theShow,
}: HoriCardProps) => {
  const locale = useLocale();
  //get genres
  const { genres } = useGetGenres({ showType, lang: locale });
  const genresNames = useMemo(() => {
    return genres(genresIds);
  }, [genres, genresIds]);

  const dispatch = useDispatch<AppDispatch>();

  const isImgLoaded = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs[backdrop_path],
    shallowEqual,
  );

  return (
    <>
      <div
        className={`lg:hover:border-s-4 border-opacity-0 lg:hover:border-opacity-100 border-blue-600
          rounded-md cursor-pointer transition-all duration-200 relative
          lg:hover:translate-y-1.5 lg:hover:shadow-lg lg:hover:shadow-blue-600/30 w-full
          ${isActive ? "border-opacity-100 translate-y-1.5 shadow-lg shadow-blue-600/30 border-s-4" : "ring-1 ring-gray-600/25 rounded-md"}`}
      >
        {/* dropdown */}
        <WatchlistFavoriteDD
          showId={showId}
          showType={showType}
          theShow={theShow}
        />
        <Link
          href={`/details/${showType}/${showId}/${nameToSlug(title)}`}
          onMouseEnter={onHover}
        >
          {!isImgLoaded && <BgPlaceholder />}
          <div
            className={`transition-[transform,opacity] duration-500 transform-gpu ease-out rounded-md
              ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95"} relative
              aspect-[450/250]`}
          >
            <Image
              src={backdrop_path}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={title}
              priority={idx === 0}
              loading={idx === 0 ? "eager" : "lazy"}
              className="object-cover object-left-bottom"
              onLoad={() => dispatch(setImageLoaded(backdrop_path))}
            />
            <div
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black from-15%
                to-transparent flex flex-col justify-end gap-2 px-3"
            >
              <div className="flex flex-col gap-2 py-2">
                {/* title */}
                <h1 className="font-medium w-fit line-clamp-1 font-roboto">
                  {title.split(" ").slice(0, 4).join(" ")}
                </h1>
                <div className="flex items-center justify-between gap-2">
                  {/* date rating */}
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <h6 className="flex items-center gap-1">
                      <FcCalendar title="Release Date" />
                      {date && new Date(date).getFullYear()}
                    </h6>
                    <h6 className="flex items-center gap-1">
                      <FaStar className="text-yellow-500" title="Rating" />
                      {rating?.toFixed(1)}
                    </h6>
                  </div>
                  {/* genres */}
                  <div className="flex items-center gap-1 text-xs">
                    <span
                      key={idx}
                      className="rounded-md text-gray-400 px-1.5 line-clamp-1 w-fit text-end"
                    >
                      {genresNames?.slice(0, 2).join(" , ")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </>
  );
};

export default memo(HoriCard) as typeof HoriCard;
