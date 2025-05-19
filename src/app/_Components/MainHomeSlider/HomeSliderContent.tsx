"use client";
import { Variants } from "framer-motion";
import Image from "next/image";
import { memo, useMemo } from "react";
import { MovieTrendsI } from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import HomeSliderBtns from "../Btns/HomeSliderBtns/HomeSliderBtns";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import useIsArabic from "@/app/hooks/useIsArabic";
import { getShowTitle } from "../../../../helpers/helpers";
import MotionWrapper from "../helpers/MotionWrapper";
import { FaStar } from "@react-icons/all-files/fa/FaStar";
import useIsDesktop from "@/app/hooks/useIsDesktop";

const imgVariants: Variants = {
  hidden: { opacity: 0, transform: "scale(0.8)" },
  visible: {
    opacity: 1,
    transform: "scale(1)",
    transition: { duration: 0.2, ease: "easeOut", delay: 0.2 },
  },
};

const contentVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut", delay: 0.2 },
  },
};

const HomeSliderContent = ({
  movie,
  isActive,
  genreNames,
  isVisible,
}: {
  movie: MovieTrendsI;
  isActive: boolean;
  isVisible: boolean;
  genreNames: string[];
}) => {
  const { isArabic } = useIsArabic();
  const isDesktop = useIsDesktop();

  const genreList = useMemo(() => {
    return genreNames.map((genre, idx) => (
      <span
        key={`${genre}-${idx}`}
        className="bg-gray-900 text-white px-1 py-0.5 sm:font-semibold"
      >
        {genre}
      </span>
    ));
  }, [genreNames]);

  const imgSrc = `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${movie.poster_path}`;
  const backdropSrc = `${isDesktop ? process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280 : process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${movie.backdrop_path}`;

  const dispatch = useDispatch();
  const isLoaded = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs[imgSrc],
    shallowEqual,
  );

  return (
    <>
      {/* Background image with overlay */}
      <div className="min-h-screen absolute top-0 w-full 4xl:py-40 -z-10">
        <div className="absolute inset-0">
          <Image
            src={backdropSrc}
            alt={(movie.title || movie.original_title) ?? "Backdrop"}
            fill
            priority={isActive && isVisible}
            loading={isActive && isVisible ? "eager" : "lazy"}
            sizes="100vw"
            quality={isDesktop ? 85 : 75}
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-black/80" />
        </div>
      </div>

      {/* Content Section */}
      <section className="px-3 sm:px-7 md:max-w-screen-sm lg:max-w-screen-xl mx-auto">
        <div
          className="flex min-h-screen xs:py-10 4xl:min-h-[unset] items-center justify-center
            xl:justify-around relative gap-6 4xl:pt-48"
        >
          {/* Left Text Content */}
          <MotionWrapper
            motionProps={{
              variants: contentVariants,
              initial: "hidden",
              animate: isActive && isVisible ? "visible" : "hidden",
            }}
            className="flex flex-col gap-4 items-center sm:items-start text-center sm:text-start
              lg:max-w-screen-sm 2xl:max-w-screen-md transform-gpu"
          >
            <h2
              className="flex gap-3 items-center text-3xl sm:text-4xl font-righteous border-s-4
                border-blue-700 ps-2 !line-clamp-2"
            >
              {getShowTitle({
                isArabic,
                show: movie,
              }) || movie?.original_title}
            </h2>
            <h6 className="flex items-center gap-1.5 xs:gap-2 text-sm flex-wrap justify-center">
              <FaStar className="text-yellow-500" />
              {movie.vote_average.toFixed(1)}
              <span className="text-gray-400">|</span>
              {movie.release_date.split("-")[0]}
              <span className="text-gray-400">|</span>
              {genreList}
            </h6>

            <div>
              {movie?.overview && (
                <p className="tracking-wide leading-relaxed text-gray-200 text-sm line-clamp-2 sm:line-clamp-5">
                  {movie.overview}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div>
              <HomeSliderBtns
                showType={movie.media_type as "movie" | "tv"}
                showId={movie.id}
                name={
                  getShowTitle({
                    isArabic,
                    show: movie,
                  }) || movie.original_title
                }
                releaseDate={movie.release_date}
              />
            </div>
          </MotionWrapper>

          {/* Movie Poster */}
          <MotionWrapper
            motionProps={{
              variants: imgVariants,
              initial: "hidden",
              animate: isActive && isVisible ? "visible" : "hidden",
            }}
            className="sm:w-[300px] sm:h-[450px] flex-none relative hidden lg:block"
          >
            {!isLoaded && <BgPlaceholder />}
            <Image
              priority={isActive && isVisible}
              loading={isActive && isVisible ? "eager" : "lazy"}
              src={imgSrc}
              fill
              sizes="300px"
              alt={
                (getShowTitle({
                  isArabic,
                  show: movie,
                }) ||
                  movie?.original_title) ??
                ""
              }
              className={`rounded-md ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                transition-[transform,opacity] duration-300 transform-gpu ease-out`}
              onLoad={() => dispatch(setImageLoaded(imgSrc))}
            />
          </MotionWrapper>
        </div>
      </section>
    </>
  );
};

export default memo(HomeSliderContent, (prevProps, nextProps) => {
  return (
    prevProps.movie.id === nextProps.movie.id &&
    prevProps.isActive === nextProps.isActive &&
    shallowEqual(prevProps.genreNames, nextProps.genreNames)
  );
}) as typeof HomeSliderContent;
