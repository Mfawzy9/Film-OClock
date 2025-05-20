"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import HomeSliderContent from "./HomeSliderContent";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { MoviesTrendsResponse } from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import dynamic from "next/dynamic";
import { GenresResponse } from "@/app/interfaces/apiInterfaces/genresInterfaces";
import useIsDesktop from "@/app/hooks/useIsDesktop";

const HomeSliderSkeleton = dynamic(() => import("./HomeSliderSkeleton"));
const ScrollToSection = dynamic(
  () => import("../ScrollToSection/ScrollToSection"),
  {
    ssr: false,
  },
);

let hasAppRendered = false;

const HomeSlider = ({
  data,
  genres,
}: {
  data: MoviesTrendsResponse;
  genres: GenresResponse | null;
}) => {
  const [shouldShowSkeleton, setShouldShowSkeleton] = useState(!hasAppRendered);

  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!hasAppRendered) {
      hasAppRendered = true;
    }
    setShouldShowSkeleton(false);
  }, []);

  const isOpen = useSelector(
    (state: RootState) => state.videoModalReducer.isOpen,
    shallowEqual,
  );
  const swiperRef = useRef<SwiperType | null>(null);

  const moviesWithGenres = useMemo(() => {
    return (
      data?.results?.slice(0, 10).map((movie) => ({
        ...movie,
        genreNames: genres?.genres
          ?.filter((genre) => movie.genre_ids.includes(genre.id))
          .slice(0, 2)

          .map(({ name }) => name),
      })) || []
    );
  }, [data, genres]);

  useEffect(() => {
    if (!swiperRef.current) return;

    swiperRef.current.autoplay?.[isOpen ? "stop" : "start"]();
  }, [isOpen, swiperRef]);

  return (
    <>
      <ScrollToSection />
      {shouldShowSkeleton ? (
        <HomeSliderSkeleton />
      ) : (
        <Swiper
          resistanceRatio={isDesktop ? 0.7 : 0.4}
          threshold={isDesktop ? 5 : 1}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={1}
          spaceBetween={10}
          autoplay={
            isDesktop
              ? {
                  delay: 10000,
                  disableOnInteraction: false,
                  waitForTransition: true,
                }
              : false
          }
          className="mySwiper"
          modules={[Autoplay]}
          style={!isDesktop ? undefined : { willChange: "transform" }}
          grabCursor={isDesktop}
        >
          {moviesWithGenres?.map((movie, idx) => {
            return (
              <SwiperSlide
                key={movie.id}
                virtualIndex={idx}
                style={!isDesktop ? undefined : { willChange: "transform" }}
                className={`${isDesktop ? "transition-[transform,opacity] transform-gpu" : ""} relative`}
              >
                {({ isActive }) => (
                  <HomeSliderContent
                    movie={movie}
                    isActive={isActive}
                    genreNames={movie?.genreNames || []}
                    isDesktop={isDesktop}
                  />
                )}
              </SwiperSlide>
            );
          })}
          <div className="absolute bottom-0 w-full h-20 bg-gradient-to-t from-black to-transparent z-10" />
        </Swiper>
      )}
    </>
  );
};

export default memo(HomeSlider, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return shallowEqual(prevProps, nextProps);
});
