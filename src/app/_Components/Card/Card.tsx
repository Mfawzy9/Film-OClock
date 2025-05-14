import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import Image from "next/image";
import { FaStar } from "react-icons/fa6";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import {
  getShowTitle,
  nameToSlug,
  scrollToTop,
} from "../../../../helpers/helpers";
import { memo, useMemo } from "react";
import { useRouter as useNextIntlRouter } from "@/i18n/navigation";
import WatchlistFavoriteDD from "../Library/WatchlistFavoriteDD/WatchlistFavoriteDD";
import { Link } from "@/i18n/navigation";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { FirestoreTheShowI } from "@/app/hooks/useLibrary";
import { useTranslations } from "next-intl";
import useIsArabic from "@/app/hooks/useIsArabic";
import { useRouter } from "@bprogress/next/app";

interface CardProps {
  src: string;
  alt: string;
  showType: "movie" | "tv" | "person";
  id: number;
  name: string;
  release_date?: string;
  rating: number;
  personJob?: string;
  idx: number;
  theShow?: Movie | TVShow | FirestoreTheShowI;
  ImgContainerHeight?: string;
}
const Card = ({
  src,
  alt,
  showType,
  id,
  name,
  release_date,
  rating,
  personJob,
  idx,
  theShow,
  ImgContainerHeight = "min-h-[330px]",
}: CardProps) => {
  const { isArabic } = useIsArabic();
  const tPerson = useTranslations("PopularPeople.Person.PersonCard");
  const editedPersonJob = useMemo(() => {
    return personJob === "Acting"
      ? tPerson("Acting")
      : personJob === "Directing"
        ? tPerson("Directing")
        : personJob === "Producing"
          ? tPerson("Producing")
          : "";
  }, [personJob, tPerson]);
  const dispatch = useDispatch<AppDispatch>();
  const isImgLoaded = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs[src],
    shallowEqual,
  );
  const router = useRouter({ customRouter: useNextIntlRouter });

  const handleNavigate = () => {
    router.push(
      `/details/${showType}/${id}/${nameToSlug(showType === "person" ? name : theShow ? (getShowTitle({ show: theShow, isArabic }) ?? name) : name)}`,
    );
    scrollToTop();
  };

  const updatedShowType =
    theShow && "showType" in theShow ? theShow.showType : showType;

  return (
    <div className="relative group w-full border border-gray-700 xs:border-none rounded">
      {/* Dropdown Menu */}
      {showType !== "person" && theShow && (
        <WatchlistFavoriteDD
          showId={id}
          showType={updatedShowType as "movie" | "tv"}
          theShow={theShow}
        />
      )}
      <Link
        href={`/details/${showType}/${id}/${nameToSlug(showType === "person" ? name : theShow ? (getShowTitle({ show: theShow, isArabic }) ?? name) : name)}`}
        className="block relative overflow-hidden pb-1 rounded w-full"
        onClick={handleNavigate}
      >
        {/* Image Container */}
        <div
          className={`relative ${!isImgLoaded && ` w-full ${ImgContainerHeight}`}`}
        >
          {!isImgLoaded && <BgPlaceholder />}
          <Image
            src={src}
            alt={alt}
            width={350}
            height={350}
            sizes="350px"
            className={`object-cover ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
              transition-[transform,opacity] duration-300 transform-gpu ease-out
              group-hover:scale-105 `}
            priority={idx < 3}
            loading={idx < 3 ? "eager" : "lazy"}
            onLoad={() => dispatch(setImageLoaded(src))}
          />
        </div>

        {/* Movie Info */}
        <div className="mt-2 px-1">
          <h3 className="text-white font-semibold line-clamp-1">
            {theShow
              ? (getShowTitle({
                  show: theShow,
                  isArabic,
                }) ?? name)
              : name}
          </h3>
          <div className="flex justify-between text-sm text-gray-300 mt-1 font-sans">
            <span>{release_date?.split("-")[0] || editedPersonJob}</span>
            <span className="flex items-center gap-1">
              <FaStar className="text-yellow-500" /> {rating?.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Overlay on Hover */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-gray-400/0 group-hover:bg-gray-400/20
            transition-all duration-300"
        />
      </Link>
    </div>
  );
};

export default memo(Card);
