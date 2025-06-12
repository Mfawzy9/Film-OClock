"use client";
import {
  useGetImagesQuery,
  useGetMTDetailsQuery,
  useGetTranslationsQuery,
} from "@/lib/Redux/apiSlices/tmdbSlice";
import Image from "next/image";
import {
  DetailsQueryParams,
  PExternalIds,
  TvDetailsResponse,
} from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import { TvCast } from "@/app/interfaces/apiInterfaces/creditsInterfaces";
import TrailerBtn from "../Btns/TrailerBtn/TrailerBtn";
import { TvImagesResponse } from "@/app/interfaces/apiInterfaces/imagesInterfaces";
import { TvReviewsResponse } from "@/app/interfaces/apiInterfaces/reviewsInterfaces";
import { VideosResponse } from "@/app/interfaces/apiInterfaces/videosInterfaces";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import dynamic from "next/dynamic";
import SocialLinks from "../SocialLinks/SocialLinks";
import { Link } from "@/i18n/navigation";
import WatchBtn from "../WatchBtn/WatchBtn";
import { TVShow } from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import WatchlistFavoriteBtns from "../Library/WatchlistFavoriteBtns/WatchlistFavoriteBtns";
import { useTranslations } from "next-intl";
import { useGetGenres } from "@/app/hooks/useGetGenres";
import useIsArabic from "@/app/hooks/useIsArabic";
import { notFound } from "next/navigation";
import LazyRender from "../LazyRender/LazyRender";
import WatchedBtn from "../WatchedBtn/WatchedBtn";
import { getShowTitle } from "../../../../helpers/helpers";
import { CgSpinner } from "@react-icons/all-files/cg/CgSpinner";
import { FaComments } from "@react-icons/all-files/fa/FaComments";
import { FaExternalLinkAlt } from "@react-icons/all-files/fa/FaExternalLinkAlt";
import { FaFilm } from "@react-icons/all-files/fa/FaFilm";
import { FaGlobeAmericas } from "@react-icons/all-files/fa/FaGlobeAmericas";
import { FaImages } from "@react-icons/all-files/fa/FaImages";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import { FcCalendar } from "@react-icons/all-files/fc/FcCalendar";
import { GiPapers } from "@react-icons/all-files/gi/GiPapers";
import { TvTranslationData } from "@/app/interfaces/apiInterfaces/translationsInterfaces";

const TvDetailsSkeleton = dynamic(() => import("./TvDetailsSkeleton"));
const EpisodesSkeletons = dynamic(() => import("./EpisodesSkeletons"));
const CardsSkeletonSlider = dynamic(
  () => import("../CardsSlider/CardsSkeletonSlider"),
);
const CastsSkeletonSlider = dynamic(
  () => import("../Casts/CastsSkeletonSlider"),
);
const Videos = dynamic(() => import("../Videos/Videos"));
const ImgsSlider = dynamic(() => import("../ImgsSlider/ImgsSlider"));
const Reviews = dynamic(() => import("../Reviews/Reviews"));
const Casts = dynamic(() => import("../Casts/Casts"));
const CardsSlider = dynamic(() => import("../CardsSlider/CardsSlider"));
const Tabs = dynamic(() => import("../Tabs/Tabs"));
const TvEpisodes = dynamic(() => import("./TvEpisodes"));

const TvDetails = ({ showId, showType }: DetailsQueryParams) => {
  const { isArabic } = useIsArabic();
  const t = useTranslations("TvDetails");
  const tabsRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();

  const moveToTabs = useCallback(() => {
    if (tabsRef.current) {
      tabsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const {
    data: tvShow,
    isLoading,
    isError,
  } = useGetMTDetailsQuery({ showId, showType, lang: "en" }) as {
    data: TvDetailsResponse;
    isLoading: boolean;
    isError: boolean;
  };

  //translations
  const { data: translations, isLoading: translationsLoading } =
    useGetTranslationsQuery({ showId, showType }, { skip: !isArabic });

  const arabicTranslations = useMemo(() => {
    const arabicSaTranslations = translations?.translations.find(
      (translation) =>
        translation.iso_639_1 === "ar" && translation.iso_3166_1 === "SA",
    )?.data;
    const arabicAeTranslations = translations?.translations.find(
      (translation) =>
        translation.iso_639_1 === "ar" && translation.iso_3166_1 === "AE",
    )?.data;
    if (arabicSaTranslations?.overview.trim()) return arabicSaTranslations;
    if (arabicAeTranslations?.overview.trim()) return arabicAeTranslations;
  }, [translations]) as TvTranslationData | undefined;

  const { finalOverview, finalTagline } = useMemo(() => {
    const getTranslatedText = (field: "overview" | "tagline") => {
      const translated = arabicTranslations?.[field];
      const original = tvShow?.[field];
      return isArabic && translated?.trim() ? translated : (original ?? "");
    };

    return {
      finalOverview: getTranslatedText("overview"),
      finalTagline: getTranslatedText("tagline"),
    };
  }, [arabicTranslations, isArabic, tvShow]);

  //get translated genres
  const { genresLoading, translatedGenres } = useGetGenres({
    showType: "tv",
    lang: isArabic ? "ar" : "en",
  });

  const { data: TvShowImages } = useGetImagesQuery({
    showId,
    showType,
  });

  const tabs = useMemo(
    () => [
      {
        name: t("Tabs.Episodes"),
        icon: <GiPapers />,
        content: (
          <LazyRender
            Component={TvEpisodes}
            props={{
              tvShow,
              seasonsCount:
                tvShow?.number_of_seasons || tvShow?.seasons?.length - 1 || 1,
              tvShowId: tvShow?.id || 0,
              tvShowName:
                getShowTitle({
                  isArabic,
                  show: tvShow,
                }) || tvShow?.original_name,
            }}
            loading={<EpisodesSkeletons />}
            persistKey={`tv-episodes-${tvShow?.id}`}
          />
        ),
      },
      {
        name: t("Tabs.Videos"),
        icon: <FaFilm />,
        content: (
          <Videos
            name={
              getShowTitle({
                isArabic,
                show: tvShow,
              }) || tvShow?.original_name
            }
            videos={tvShow?.videos as VideosResponse}
          />
        ),
      },
      {
        name: t("Tabs.Images"),
        icon: <FaImages />,
        content: (
          <ImgsSlider
            name={
              getShowTitle({
                isArabic,
                show: tvShow,
              }) || tvShow?.original_name
            }
            images={TvShowImages as TvImagesResponse}
          />
        ),
      },
      {
        name: t("Tabs.Reviews"),
        icon: <FaComments />,
        content: <Reviews reviews={tvShow?.reviews as TvReviewsResponse} />,
      },
    ],
    [tvShow, TvShowImages, t, isArabic],
  );
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const imgSrc = `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${tvShow?.poster_path}`;

  const isImgLoaded = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs[imgSrc],
    shallowEqual,
  );

  const handleImageLoad = useCallback(() => {
    dispatch(setImageLoaded(imgSrc));
  }, [dispatch, imgSrc]);

  const [needsExpand, setNeedsExpand] = useState(false);
  const overviewRef = useRef<HTMLParagraphElement>(null);
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  // Function to toggle overview expansion
  const toggleOverview = () => {
    setIsOverviewExpanded(!isOverviewExpanded);
  };

  useEffect(() => {
    if (overviewRef.current && finalOverview && !isLoading) {
      const p = overviewRef.current;
      const isOverflowing = p.scrollHeight - p.clientHeight > 2;
      setNeedsExpand(isOverflowing);
    }
  }, [isLoading, finalOverview]);

  if (isLoading || translationsLoading) return <TvDetailsSkeleton />;
  if (isError) return notFound();

  return (
    <>
      {/* layer and bg */}
      <div className="min-h-screen absolute w-full -z-10">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}${tvShow?.backdrop_path}`}
          alt={tvShow?.name || tvShow?.original_name || "background"}
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-0 bg-black/80" />
      </div>

      <section className="px-3 sm:px-7 pt-28 md:pt-0 lg:max-w-screen-xl mx-auto mb-24">
        <div
          className={`flex flex-col min-h-screen 3xl:min-h-[unset] md:flex-row
            ${isOverviewExpanded ? "md:items-start" : "md:items-center"} relative md:pt-32
            gap-6 4xl:pt-48`}
        >
          {/* Tvshow Poster */}
          <div className="sm:w-[300px] sm:h-fit mx-auto md:mx-0 flex-none relative flex flex-col gap-4">
            {!isImgLoaded && <BgPlaceholder />}
            <Image
              src={imgSrc}
              width={300}
              height={450}
              alt={`${tvShow?.name || tvShow?.original_name || "Tv Show"} Poster`}
              priority
              className={`sm:w-[300px] sm:h-[450px] rounded-t-md
                ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                transition-[transform,opacity] duration-300 transform-gpu ease-out`}
              onLoad={handleImageLoad}
            />
            {new Date(tvShow?.first_air_date) <= new Date() && (
              <WatchedBtn
                showId={showId}
                showName={
                  getShowTitle({
                    isArabic,
                    show: tvShow,
                  }) ||
                  tvShow?.original_name ||
                  ""
                }
                theShow={tvShow}
              />
            )}
            <div className="flex justify-center">
              <SocialLinks externalIds={tvShow?.external_ids as PExternalIds} />
            </div>
          </div>

          {/* Tvshow Info */}
          <div className="flex flex-col gap-3 md:flex-1">
            <h2 className="text-4xl font-righteous flex gap-3 items-center ps-2 border-s-4 border-blue-700">
              {isArabic && tvShow?.original_language === "ar"
                ? arabicTranslations?.name || tvShow?.original_name
                : tvShow?.name}
              {tvShow?.homepage && (
                <a
                  href={tvShow?.homepage}
                  target="_blank"
                  className="hover:text-blue-700"
                  rel="noopener noreferrer"
                >
                  <FaExternalLinkAlt title="Home page" className="text-base" />
                </a>
              )}
            </h2>

            {/* rating date seasons */}
            <h6 className="flex items-center gap-2 flex-wrap">
              <FaStar className="text-yellow-500" title="Rating" />
              {tvShow?.vote_average.toFixed(1)}
              <span className="text-gray-400">|</span>
              {tvShow?.last_air_date && (
                <>
                  <FcCalendar title="Last Date" />
                  {new Date(tvShow?.last_air_date).getFullYear()}
                </>
              )}
              <span className="text-gray-400">|</span>
              <GiPapers title={t("Seasons")} />
              {tvShow?.number_of_seasons > 1
                ? tvShow?.number_of_seasons + ` ${t("Seasons")}`
                : tvShow?.number_of_seasons + ` ${t("Season")}`}
              <span className="text-gray-400">|</span>
              <FaGlobeAmericas
                className="text-lg"
                title={t("TvShowLanguage")}
              />
              {tvShow?.original_language.toUpperCase()}
            </h6>

            {/* genres */}
            {translatedGenres?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {translatedGenres(tvShow)?.map((genre, idx) => (
                  <Link
                    href={`/shows/all/tv?page=1&genre=${genre.id}&genreName=${genre.genreName}`}
                    key={idx}
                    className="bg-gray-900 rounded-md text-white px-1.5 py-0.5 text-sm font-semibold"
                  >
                    {genresLoading ? (
                      <CgSpinner className="animate-spin" />
                    ) : (
                      genre.genreName
                    )}
                  </Link>
                ))}
              </div>
            )}

            {/* dates */}
            <div className="space-y-3">
              {tvShow?.first_air_date && (
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold">{t("FirstAirDate")}</h4>
                  <p className="text-gray-200">
                    {new Date(tvShow?.first_air_date).toLocaleString(
                      isArabic ? "ar" : "en-US",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              )}

              {tvShow?.last_air_date && (
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold">{t("LastAirDate")}</h4>
                  <p className="text-gray-200">
                    {new Date(tvShow?.last_air_date).toLocaleString(
                      isArabic ? "ar" : "en-US",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* status */}
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-bold">{t("Status")}</h4>
              <p
                className={`${tvShow?.status === "Ended" ? "text-red-500" : tvShow?.status === "Canceled" ? "text-yellow-500" : "text-green-500"}`}
              >
                {tvShow?.status === "Ended"
                  ? t("Ended")
                  : tvShow?.status === "Canceled"
                    ? t("Canceled")
                    : t("ReturningSeries")}
              </p>
              <TrailerBtn
                showType={showType as "movie" | "tv"}
                showId={showId}
              />
            </div>

            {/* tagline & overview */}
            {finalTagline && (
              <p className="text-gray-400 text-sm">{finalTagline}</p>
            )}

            {finalOverview && (
              <div>
                <h4 className="font-bold text-xl">{t("Overview")}</h4>
                <p
                  ref={overviewRef}
                  className={`tracking-wide leading-relaxed text-gray-200 text-sm ${
                  !isOverviewExpanded ? "line-clamp-4" : "" }`}
                >
                  {finalOverview}
                </p>
                {needsExpand && (
                  <button
                    onClick={toggleOverview}
                    className="mt-2 text-blue-500 hover:underline"
                  >
                    {isOverviewExpanded ? t("ViewLess") : t("ViewMore")}
                  </button>
                )}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center flex-wrap gap-4">
              {new Date(tvShow?.first_air_date) <= new Date() && (
                <WatchBtn
                  name={
                    getShowTitle({
                      isArabic,
                      show: tvShow,
                    }) || tvShow?.original_name
                  }
                  moveToTabs={moveToTabs}
                  showType={showType as "movie" | "tv"}
                  showId={showId}
                />
              )}
              {/* watchlist & favorites */}
              <WatchlistFavoriteBtns showId={showId} theShow={tvShow} />
            </div>

            {/* Creator */}
            {tvShow?.created_by?.length > 0 && (
              <h6 className="font-bold">
                {t("Creator")}{" "}
                <Link
                  href={`/details/person/${tvShow?.created_by[0]?.id}/${tvShow?.created_by[0]?.name?.replace(/\s/g, "-").toLowerCase()}`}
                >
                  <span className="hover:underline text-blue-500 font-semibold">
                    {tvShow?.created_by[0]?.name}
                  </span>{" "}
                </Link>
              </h6>
            )}
          </div>
        </div>

        {/* tv Casts */}
        {tvShow?.credits?.cast?.length > 0 && (
          <LazyRender
            persistKey={`casts-${tvShow?.id}`}
            Component={Casts}
            props={{
              casts: tvShow?.credits?.cast as TvCast[],
              label: t("TopBilledCast"),
            }}
            loading={
              <CastsSkeletonSlider length={tvShow?.credits?.cast?.length} />
            }
          />
        )}

        {/* Tabs (Videos, Images, Reviews) */}
        {tvShow && (
          <>
            <div ref={tabsRef} />
            <Tabs
              tabs={tabs}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </>
        )}

        {/* Recommendations & Similar Movies */}
        <div className="flex flex-col gap-6">
          <LazyRender
            persistKey={`recommendations-${tvShow?.id}`}
            Component={CardsSlider}
            props={{
              theShows: tvShow?.recommendations?.results as TVShow[],
              showType,
              sliderType: "tvShows",
              className: "mt-10",
              title: t("Recommendations"),
            }}
            loading={<CardsSkeletonSlider />}
            rootMargin="200px 0px"
          />

          <LazyRender
            persistKey={`similar-${tvShow?.id}`}
            Component={CardsSlider}
            props={{
              theShows: tvShow?.similar?.results as TVShow[],
              showType,
              sliderType: "tvShows",
              className: "mt-10",
              title: t("Similar"),
            }}
            loading={<CardsSkeletonSlider />}
            rootMargin="200px 0px"
          />
        </div>
      </section>
    </>
  );
};

export default TvDetails;
