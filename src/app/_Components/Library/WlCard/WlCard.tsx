import TrailerBtn from "../../Btns/TrailerBtn/TrailerBtn";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import WatchlistFavoriteDD from "../WatchlistFavoriteDD/WatchlistFavoriteDD";
import { FirestoreTheShowI } from "@/app/hooks/useLibrary";
import { memo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import BgPlaceholder from "../../BgPlaceholder/BgPlaceholder";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import { useTranslations } from "next-intl";
import useIsArabic from "@/app/hooks/useIsArabic";
import { getShowTitle, nameToSlug } from "../../../../../helpers/helpers";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import { FcCalendar } from "@react-icons/all-files/fc/FcCalendar";
import { ImList } from "@react-icons/all-files/im/ImList";

const WlCard = ({ show }: { show: FirestoreTheShowI }) => {
  const t = useTranslations("Library.Watchlist");
  const { isArabic } = useIsArabic();
  const posterSrc = `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${show.posterPath}`;
  const dispatch = useDispatch();
  const isImgLoaded = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs[posterSrc],
    shallowEqual,
  );

  const title = isArabic && show.arTitle ? show.arTitle : show.title;
  const overview = isArabic ? show.arOverview || show.overview : show.overview;
  return (
    <main className="rounded-md bg-gray-900/80 border border-gray-700 shadow-lg relative">
      <WatchlistFavoriteDD
        showId={show?.id}
        showType={show?.showType}
        theShow={show}
      />
      <div className="md:flex leading-none max-w-4xl lg:max-w-3xl xl:min-w-[60rem] 2xl:min-w-[70rem]">
        {/* poster */}
        <div
          className={`flex-none md:ps-4 relative ${ !isImgLoaded &&
            "min-w-[250px] min-h-[380px] mx-auto" }`}
        >
          {!isImgLoaded && <BgPlaceholder />}
          <Link
            href={`/details/${show?.showType}/${show.id}/${nameToSlug(
              getShowTitle({
                isArabic,
                show,
              }) ?? title,
            )}`}
          >
            <Image
              width={225}
              height={290}
              src={posterSrc}
              alt={show.title}
              loading="lazy"
              className={` rounded-md transform -translate-y-4 border-4 border-gray-400 block mx-auto
                ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                transition-[transform,opacity] duration-300 transform-gpu ease-out`}
              onLoad={() => dispatch(setImageLoaded(posterSrc))}
            />
          </Link>
        </div>
        <div className="flex flex-col gap-5 py-2 px-2 sm:px-4 mt-4 w-full">
          <h2 className="text-2xl font-bold font-righteous border-b-4 w-fit pb-1 pe-8 border-blue-700">
            {title}
          </h2>

          <p
            className="text-sm text-start text-gray-300 leading-relaxed tracking-wide line-clamp-5
              md:mt-5 max-w-xl"
          >
            {overview}
          </p>

          {/* btns */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center flex-wrap gap-5">
              <Link
                className="flex-none max-h-11 relative flex items-center justify-center rounded-xl
                  bg-gray-950 px-6 py-3.5 font-semibold text-white transition-all duration-200
                  hover:bg-gray-950 hover:-translate-y-0.5 lg:hover:shadow-blueGlow"
                href={`/details/${show.showType}/${show.id}/${nameToSlug(
                  getShowTitle({
                    isArabic,
                    show,
                  }) ?? title,
                )}`}
              >
                <ImList className="me-1" />
                {t("WlCard.DetailsBtn")}
              </Link>
              <TrailerBtn showType={show.showType} showId={show.id} />
            </div>
          </div>
          <hr className="border-gray-600 mt-auto" data-content />
          {/* date and rating */}
          <div className="flex items-center justify-between relative">
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <FcCalendar title="Release Date" />
              {show.releaseDate.split("-")[0]}
            </p>
            <h5
              className="absolute end-1/2 xs:end-2 -translate-x-1/2 bottom-1 xs:bottom-14
                xs:translate-x-0 flex-none rotate-12 px-4 py-1 font-semibold rounded-full
                bg-gradient-to-r from-green-950 via-sky-950 to-red-950 text-gray-50"
            >
              {show.showType === "movie"
                ? t("WlCard.Movie")
                : t("WlCard.TvShow")}
            </h5>
            <p className="text-sm text-gray-400 flex items-center gap-1">
              <FaStar className="text-yellow-500" title="Rating" />
              {show.rating.toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default memo(WlCard) as typeof WlCard;
