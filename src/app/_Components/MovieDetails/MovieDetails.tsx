"use client";
import tmdbApi, {
  useGetImagesQuery,
  useGetMTDetailsQuery,
  useGetTranslationsQuery,
} from "@/lib/Redux/apiSlices/tmdbSlice";
import Image from "next/image";
import {
  FaStar,
  FaFilm,
  FaImages,
  FaComments,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  DetailsQueryParams,
  MovieDetailsResponse,
  PExternalIds,
} from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import { getShowTitle, minutesToHours } from "../../../../helpers/helpers";
import TrailerBtn from "../Btns/TrailerBtn/TrailerBtn";
import { MovieImagesResponse } from "@/app/interfaces/apiInterfaces/imagesInterfaces";
import { MovieReviewsResponse } from "@/app/interfaces/apiInterfaces/reviewsInterfaces";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { useMemo, useCallback, useState, useRef, useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import dynamic from "next/dynamic";
import SocialLinks from "../SocialLinks/SocialLinks";
import { GrLanguage } from "react-icons/gr";
import WatchBtn from "../WatchBtn/WatchBtn";
import { Movie } from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { Link } from "@/i18n/navigation";
import WatchlistFavoriteBtns from "../Library/WatchlistFavoriteBtns/WatchlistFavoriteBtns";
import { FcCalendar, FcClock } from "react-icons/fc";
import useIsArabic from "@/app/hooks/useIsArabic";
import { useTranslations } from "next-intl";
import { useGetGenres } from "@/app/hooks/useGetGenres";
import { notFound } from "next/navigation";
import { MovieTranslationsResponse } from "@/app/interfaces/apiInterfaces/translationsInterfaces";
import LazyRender from "../LazyRender/LazyRender";
import CardsSkeletonSlider from "../CardsSlider/CardsSkeletonSlider";
import CastsSkeletonSlider from "../Casts/CastsSkeletonSlider";
import VideosDetailsSkeletons from "../Videos/VideosDetailsSkeletons";
import WatchedBtn from "../WatchedBtn/WatchedBtn";
import SkeletonMovieCollectionBanner from "../MovieCollectionBanner/SkeletonMovieCollectionBanner";
import MovieDetailsSkeleton from "./MovieDetailsSkeleton";

const Videos = dynamic(() => import("../Videos/Videos"));
const ImgsSlider = dynamic(() => import("../ImgsSlider/ImgsSlider"));
const Reviews = dynamic(() => import("../Reviews/Reviews"));
const Casts = dynamic(() => import("../Casts/Casts"));
const CardsSlider = dynamic(() => import("../CardsSlider/CardsSlider"));
const Tabs = dynamic(() => import("../Tabs/Tabs"));
const MovieCollectionBanner = dynamic(
  () => import("../MovieCollectionBanner/MovieCollectionBanner"),
);

interface props extends DetailsQueryParams {
  initialData: MovieDetailsResponse | null;
  initialTranslations: MovieTranslationsResponse | null;
}

const MovieDetails = ({
  showId,
  showType,
  initialData,
  initialTranslations,
}: props) => {
  const { isArabic } = useIsArabic();
  const t = useTranslations("MovieDetails");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (initialData) {
      dispatch(
        tmdbApi.util.upsertQueryData(
          "getMTDetails",
          { showId, showType },
          initialData,
        ),
      );
    }
  }, [dispatch, initialData, showId, showType]);

  useEffect(() => {
    if (initialTranslations) {
      dispatch(
        tmdbApi.util.upsertQueryData(
          "getTranslations",
          { showId, showType },
          initialTranslations,
        ),
      );
    }
  }, [dispatch, initialTranslations, showId, showType]);

  const {
    data: movie,
    isLoading: detailsLoading,
    isError,
  } = useGetMTDetailsQuery({ showId, showType }) as {
    data: MovieDetailsResponse;
    isLoading: boolean;
    isError: boolean;
  };

  const { data: translations, isLoading: translationsLoading } =
    useGetTranslationsQuery({ showId, showType }, { skip: !isArabic });

  const arabicTranslations = useMemo(() => {
    const arabicSaTranslations = translations?.translations?.find(
      (translation) =>
        translation.iso_639_1 === "ar" && translation.iso_3166_1 === "SA",
    )?.data;
    const arabicAeTranslations = translations?.translations?.find(
      (translation) =>
        translation.iso_639_1 === "ar" && translation.iso_3166_1 === "AE",
    )?.data;
    if (arabicSaTranslations?.overview.trim()) return arabicSaTranslations;
    if (arabicAeTranslations?.overview.trim()) return arabicAeTranslations;
  }, [translations]);

  const { finalOverview, finalTagline } = useMemo(() => {
    const getTranslatedText = (field: "overview" | "tagline") => {
      const translated = arabicTranslations?.[field];
      const original = movie?.[field];
      return isArabic && translated?.trim() ? translated : (original ?? "");
    };

    return {
      finalOverview: getTranslatedText("overview"),
      finalTagline: getTranslatedText("tagline"),
    };
  }, [arabicTranslations, isArabic, movie]);

  //get translated genres
  const { genresLoading, translatedGenres } = useGetGenres({
    showType: "movie",
    lang: isArabic ? "ar" : "en",
  });

  const director = useMemo(
    () => movie?.credits?.crew?.find((crew) => crew.job === "Director"),
    [movie],
  );

  //images
  const { data: movieImages, isLoading: imagesLoading } = useGetImagesQuery({
    showId,
    showType,
  });

  const isLoading = detailsLoading || imagesLoading;

  const tabs = useMemo(
    () => [
      {
        name: t("Tabs.Videos"),
        icon: <FaFilm />,
        content: (
          <LazyRender
            Component={Videos}
            props={{
              name:
                getShowTitle({
                  isArabic,
                  show: movie,
                }) ?? movie?.original_title,
              videos: movie?.videos,
            }}
            rootMargin="0px 0px"
            persistKey={`videos-${showId}-${showType}`}
            loading={
              <VideosDetailsSkeletons
                length={
                  movie?.videos?.results?.filter(
                    (video) => video.type === "Trailer",
                  )?.length
                }
              />
            }
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
                show: movie,
              }) ?? movie?.original_title
            }
            images={movieImages as MovieImagesResponse}
          />
        ),
      },
      {
        name: t("Tabs.Reviews"),
        icon: <FaComments />,
        content: <Reviews reviews={movie?.reviews as MovieReviewsResponse} />,
      },
    ],
    [movie, movieImages, t, showId, showType, isArabic],
  );
  const [activeTab, setActiveTab] = useState(tabs[0]?.name || "");

  const imgSrc = `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${movie?.poster_path}`;

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
    if (overviewRef.current && movie?.overview && !isLoading) {
      const p = overviewRef.current;
      const isOverflowing = p.scrollHeight - p.clientHeight > 2; // allow tiny margin
      setNeedsExpand(isOverflowing);
    }
  }, [movie?.overview, isLoading]);

  if (isLoading || translationsLoading || genresLoading)
    return <MovieDetailsSkeleton />;
  if (isError) return notFound();

  return (
    <>
      {/* layer and bg */}
      <div className="min-h-screen absolute w-full -z-10">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}${movie?.backdrop_path}`}
          alt={movie?.title || movie?.original_title || "background"}
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
            ${isOverviewExpanded ? "items-start" : "items-center"} justify-center relative
            md:pt-32 gap-6 4xl:pt-48`}
        >
          {/* Movie Poster */}
          <div className="sm:w-[300px] sm:h-fit mx-auto md:mx-0 flex-none relative flex flex-col gap-4">
            {!isImgLoaded && <BgPlaceholder />}

            <Image
              src={imgSrc}
              width={300}
              height={450}
              alt={`${movie?.title || movie?.original_title || "Movie"} Poster`}
              priority
              className={`sm:w-[300px] sm:h-[450px] rounded-t-md
                ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                transition-[transform,opacity] duration-300 transform-gpu ease-out`}
              onLoad={handleImageLoad}
            />
            {new Date(movie?.release_date) <= new Date() && (
              <WatchedBtn
                showId={showId}
                showName={
                  getShowTitle({
                    isArabic,
                    show: movie,
                  }) ||
                  movie?.original_title ||
                  ""
                }
                theShow={movie}
              />
            )}
            <div className="flex justify-center">
              <SocialLinks externalIds={movie?.external_ids as PExternalIds} />
            </div>
          </div>

          {/* Movie Info */}
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-righteous flex gap-3 items-center ps-2 border-s-4 border-blue-700">
              {getShowTitle({
                isArabic,
                show: movie,
              }) || movie?.original_title}
              {movie?.homepage && (
                <a
                  href={movie?.homepage}
                  target="_blank"
                  className="hover:text-blue-700"
                  rel="noopener noreferrer"
                >
                  <FaExternalLinkAlt title="Home page" className="text-base" />
                </a>
              )}
            </h2>

            <h6 className="flex items-center gap-2 flex-wrap">
              <FaStar className="text-yellow-500" title="Rating" />
              {movie?.vote_average?.toFixed(1)}
              <span className="text-gray-400">|</span>
              <FcCalendar title="Release Date" />
              {movie?.release_date &&
                new Date(movie?.release_date).getFullYear()}
              <span className="text-gray-400">|</span>
              <FcClock title="Duration" className="text-black" />
              {minutesToHours(movie?.runtime ?? 0, isArabic)}
              <span className="text-gray-400">|</span>
              <GrLanguage title="Language" />
              {movie?.original_language?.toUpperCase()}
            </h6>

            <div className="flex items-center gap-2 flex-wrap">
              {translatedGenres(movie)?.map((genre, idx) => (
                <Link
                  href={`/shows/all/movie?page=1&genre=${genre.id}&genreName=${genre.genreName}`}
                  key={idx}
                  className="bg-gray-900 rounded-md text-white px-1.5 py-0.5 text-sm font-semibold"
                >
                  {genre.genreName}
                </Link>
              ))}
            </div>

            {finalTagline && (
              <p className="text-gray-400 text-sm">{finalTagline}</p>
            )}

            {finalOverview && (
              <div>
                <h4 className="font-bold text-xl">{t("Overview")}</h4>
                <p
                  ref={overviewRef}
                  className={`tracking-wide leading-relaxed text-gray-200 text-sm ${
                  !isOverviewExpanded ? "line-clamp-6" : "" }`}
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

            {/* watchlist & favorite */}
            <WatchlistFavoriteBtns showId={showId} theShow={movie} />

            {/* Buttons */}
            <div className="flex flex-col xs:flex-row items-center flex-wrap gap-3">
              {new Date(movie?.release_date) <= new Date() && (
                <WatchBtn
                  showType={showType as "movie" | "tv"}
                  showId={showId}
                  name={
                    getShowTitle({
                      isArabic,
                      show: movie,
                    }) || movie?.original_title
                  }
                />
              )}
              <TrailerBtn
                showType={showType as "movie" | "tv"}
                showId={showId}
              />
            </div>

            {/* Director */}
            <h6 className="font-bold">
              {t("Director")}:{" "}
              <Link href={`/details/person/${director?.id}/${director?.name}`}>
                <span className="hover:underline text-blue-500 font-semibold">
                  {director?.name}
                </span>
              </Link>
            </h6>
          </div>
        </div>

        {/* Movie Casts */}
        {movie?.credits?.cast?.length > 0 && (
          <LazyRender
            Component={Casts}
            loading={
              <CastsSkeletonSlider length={movie?.credits?.cast?.length} />
            }
            props={{ casts: movie?.credits?.cast, label: t("TopBilledCast") }}
            rootMargin="0px 0px"
          />
        )}

        {/* Tabs (Videos, Images, Reviews) */}
        {movie && (
          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        {/* collection */}
        {movie?.belongs_to_collection && (
          // <MovieCollectionBanner movie={movie} className="my-10" />
          <LazyRender
            Component={MovieCollectionBanner}
            props={{ movie, className: "my-10" }}
            rootMargin="0px 0px"
            loading={<SkeletonMovieCollectionBanner className="my-10" />}
          />
        )}

        {/* Recommendations & Similar Movies */}
        <div className="flex flex-col gap-6">
          <LazyRender
            Component={CardsSlider}
            loading={<CardsSkeletonSlider />}
            props={{
              theShows: movie?.recommendations?.results as Movie[],
              showType,
              sliderType: "movies",
              className: "mt-10",
              title: t("Recommendations"),
            }}
            rootMargin="200px "
          />

          <LazyRender
            Component={CardsSlider}
            loading={<CardsSkeletonSlider />}
            props={{
              theShows: movie?.similar?.results as Movie[],
              showType,
              sliderType: "movies",
              className: "mt-10",
              title: t("Similar"),
            }}
            rootMargin="200px "
          />
        </div>
      </section>
    </>
  );
};

export default MovieDetails;
