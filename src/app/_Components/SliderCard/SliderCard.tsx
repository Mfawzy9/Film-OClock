import Image from "next/image";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import {
  getShowTitle,
  nameToSlug,
  scrollToTop,
} from "../../../../helpers/helpers";
import { useRouter as useNextIntlRouter } from "@/i18n/navigation";
import WatchlistFavoriteDD from "../Library/WatchlistFavoriteDD/WatchlistFavoriteDD";
import { Link } from "@/i18n/navigation";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { useTranslations } from "next-intl";
import { useRouter } from "@bprogress/next/app";
import { FaStar } from "@react-icons/all-files/fa/FaStar";

interface SliderCardProps {
  srcKey: string;
  alt: string;
  showType: "movie" | "tv" | "person";
  id: number;
  name: string;
  release_date: string;
  rating?: number;
  personJob?: string;
  theShow: Movie | TVShow;
  idx: number;
  isArabic: boolean;
}

const SliderCard = ({
  srcKey,
  alt,
  showType,
  id,
  name,
  release_date,
  rating,
  personJob,
  theShow,
  idx,
  isArabic,
}: SliderCardProps) => {
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

  const posterSrc = `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${srcKey}`;

  const dispatch = useDispatch<AppDispatch>();
  const isImgLoaded = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs[posterSrc],
    shallowEqual,
  );

  const router = useRouter({ customRouter: useNextIntlRouter });
  const [dropDownMenu, setDropDownMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleNavigate = () => {
    router.push(
      `/details/${showType}/${id}/${nameToSlug(showType === "person" ? name : theShow ? (getShowTitle({ show: theShow, isArabic }) ?? name) : name)}`,
    );
    scrollToTop();
  };

  useEffect(() => {
    if (!dropDownMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropDownMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDownMenu]);

  return (
    <div className="group block relative overflow-hidden pb-1 w-[235px]">
      {/* Dropdown Menu */}
      {showType !== "person" && (
        <WatchlistFavoriteDD
          showId={id}
          showType={showType}
          theShow={theShow}
        />
      )}
      <Link
        href={`/details/${showType}/${id}/${nameToSlug(showType === "person" ? name : theShow ? (getShowTitle({ show: theShow, isArabic }) ?? name) : name)}`}
        onClick={handleNavigate}
      >
        {/* Image Container */}
        <div className="relative h-[350px] xl:h-[300px]">
          {!isImgLoaded && <BgPlaceholder />}
          <Image
            src={posterSrc}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
              transition-[transform,opacity] duration-300 transform-gpu ease-out
              lg:group-hover:scale-105 `}
            loading={idx < 3 ? "eager" : "lazy"}
            priority={idx < 3}
            onLoad={() => dispatch(setImageLoaded(posterSrc))}
          />
        </div>

        {/* Movie Info */}
        <div className="mt-2 px-1">
          <h3 className="text-white font-semibold line-clamp-1">
            {getShowTitle({
              show: theShow,
              isArabic,
            }) ?? name}
          </h3>
          <div className="flex justify-between text-sm text-gray-300 mt-1 font-sans">
            <span>{release_date.split("-")[0] || editedPersonJob}</span>
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

export default memo(SliderCard);
