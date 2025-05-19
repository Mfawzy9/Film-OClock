import {
  PopularPersonI,
  PopularPersonMovieI,
  PopularPersonTvShowI,
} from "@/app/interfaces/apiInterfaces/popularMoviesTvInterfaces";
import Image from "next/image";
import castBg from "../../../../public/images/castBackDrop.jpg";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { Link } from "@/i18n/navigation";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import { memo, useMemo } from "react";
import {
  getShowTitle,
  nameToSlug,
  scrollToTop,
} from "../../../../helpers/helpers";
import { TFunction } from "../../../../global";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import useIsArabic from "@/app/hooks/useIsArabic";
import { FaChevronCircleUp } from "@react-icons/all-files/fa/FaChevronCircleUp";
import { FcRating } from "@react-icons/all-files/fc/FcRating";
import { FcReading } from "@react-icons/all-files/fc/FcReading";

function getCastCardWorkLink(
  work: PopularPersonMovieI | PopularPersonTvShowI,
  isArabic: boolean,
) {
  const title =
    (work as PopularPersonMovieI).title ||
    (work as PopularPersonMovieI).original_title ||
    (work as PopularPersonTvShowI).name ||
    (work as PopularPersonTvShowI).original_name ||
    "";

  const slug = nameToSlug(
    getShowTitle({
      show: work as Movie | TVShow,
      isArabic,
    }) ?? title,
  );
  return `/details/${work?.media_type}/${work?.id}/${slug}`;
}

const CastCard = ({ person, t }: { person: PopularPersonI; t: TFunction }) => {
  const { isArabic } = useIsArabic();
  const editedPersonJob = useMemo(() => {
    return person.known_for_department === "Acting"
      ? t("Person.PersonCard.Acting")
      : person.known_for_department === "Directing"
        ? t("Person.PersonCard.Directing")
        : person.known_for_department === "Producing"
          ? t("Person.PersonCard.Producing")
          : "";
  }, [person, t]);
  const dispatch = useDispatch<AppDispatch>();

  const loadedImgs = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs,
    shallowEqual,
  );

  if (!person) return null;
  return (
    <div
      key={person.id}
      className="rounded-lg shadow bg-gray-900 shadow-blue-700/70"
    >
      {/* backdrop */}
      <div className="h-28 overflow-hidden rounded-t-lg relative">
        <Image
          src={castBg}
          alt={person.name}
          fill
          priority={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="h-full w-full object-cover object-bottom"
        />
        {/* layer */}
        <span className="absolute bottom-0 left-0 w-full h-full bg-black/75" />
      </div>
      {/* profile image */}
      <div
        className="mx-auto flex justify-center items-center -mt-20 w-32 h-32 overflow-hidden
          rounded-full border-2 border-gray-500 bg-black relative z-10"
      >
        {!loadedImgs[person?.profile_path ?? ""] && <BgPlaceholder />}
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W200}/${person.profile_path}`}
          alt={person.name}
          width={100}
          height={100}
          sizes="100px"
          loading="lazy"
          className={`object-fill object-center w-full h-auto
            ${person.profile_path && loadedImgs[person?.profile_path] ? "opacity-100 scale-100" : "opacity-0 scale-90"}
            transition-[transform,opacity] duration-300 transform-gpu ease-out`}
          onLoad={() => dispatch(setImageLoaded(person.profile_path ?? ""))}
        />
      </div>
      {/* name */}
      <div className="p-3">
        <h4 className="mb-2 text-xl font-semibold text-center">
          {person.name}
        </h4>
        {/* attributes */}
        <div className="flex items-center justify-center md:justify-start flex-wrap gap-2">
          <h4
            className="bg-gray-900 text-white px-2 py-1 text-sm rounded flex flex-col gap-1 border
              md:grow border-gray-600"
          >
            <span className="text-gray-300">
              {t("featuredCast.Popularity")}
            </span>
            <span className="flex items-center gap-1 font-bold">
              <FcRating className="text-lg" /> {person?.popularity?.toFixed(1)}
            </span>
          </h4>
          <h4
            className="bg-gray-900 text-white px-2 py-1 text-sm rounded flex flex-col gap-1 border
              md:grow border-gray-600"
          >
            <span className="text-gray-300">{t("featuredCast.KnownAs")} </span>
            <span className="flex items-center gap-1 font-bold">
              <FcReading className="text-lg" /> {editedPersonJob}
            </span>
          </h4>
        </div>
        {/* latest works imgs*/}
        <div className="flex flex-col gap-2 mt-2">
          <h2
            className="italic relative after:content-[''] after:absolute after:-bottom-1 after:start-0
              after:w-6 after:h-1 after:bg-blue-800 mb-2 text-sm"
          >
            {t("featuredCast.KnownFor")}
          </h2>
          <div className="flex flex-wrap justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {person.known_for?.map((work, idx) => {
                if (!work?.poster_path) return null;
                const isImgLoaded = work?.poster_path
                  ? loadedImgs[work?.poster_path]
                  : false;
                return (
                  <Link
                    key={idx}
                    href={getCastCardWorkLink(work, isArabic)}
                    className="group"
                  >
                    <div
                      key={idx}
                      className="w-[55px] h-[90px] flex-none relative rounded-md"
                    >
                      {!isImgLoaded && <BgPlaceholder />}
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W200}${work?.poster_path}`}
                        fill
                        sizes="55px"
                        alt={
                          (work as PopularPersonMovieI)?.title ||
                          (work as PopularPersonMovieI).original_title ||
                          (work as PopularPersonTvShowI)?.name ||
                          (work as PopularPersonTvShowI).original_name
                        }
                        loading="lazy"
                        className={`rounded-md w-auto h-auto object-cover lg:group-hover:scale-110
                        ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                        transition-[transform,opacity] duration-300 transform-gpu ease-out `}
                        onLoad={() =>
                          dispatch(setImageLoaded(work?.poster_path as string))
                        }
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
            {/* view profile */}
            <Link
              href={`/details/person/${person?.id}/${nameToSlug(person?.name ?? "")}`}
              title={t("featuredCast.ViewProfile")}
              onClick={scrollToTop}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-600 lg:hover:shadow-blueGlow
                px-4 py-2 h-10 self-end rounded text-white flex-none"
            >
              <span>{t("featuredCast.ViewProfile")}</span>
              <FaChevronCircleUp />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CastCard);
