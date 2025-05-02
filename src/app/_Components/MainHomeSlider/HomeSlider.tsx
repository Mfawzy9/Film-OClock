"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Virtual } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import HomeSliderContent from "./HomeSliderContent";
import { memo, useEffect, useMemo, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { useGetGenres } from "@/app/hooks/useGetGenres";
import { MovieTrendsI } from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import useIsArabic from "@/app/hooks/useIsArabic";

const HomeSlider = ({ data }: { data: MovieTrendsI[] }) => {
  const { isArabic } = useIsArabic();
  const isOpen = useSelector(
    (state: RootState) => state.videoModalReducer.isOpen,
    (prev, next) => prev === next,
  );
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(
    null as SwiperType | null,
  );

  const { genres } = useGetGenres({
    showType: "movie",
    lang: isArabic ? "ar" : "en",
  });

  const moviesWithGenres = useMemo(() => {
    return (
      data?.slice(0, 10).map((movie) => ({
        ...movie,
        genreNames: genres(movie.genre_ids),
      })) || []
    );
  }, [data, genres]);

  useEffect(() => {
    if (!swiperInstance) return;

    swiperInstance.autoplay?.[isOpen ? "stop" : "start"]();
  }, [isOpen, swiperInstance]);

  return (
    <>
      <Swiper
        resistanceRatio={0.7}
        threshold={5}
        onSwiper={(swiper) => setSwiperInstance(swiper)}
        slidesPerView={1}
        spaceBetween={10}
        grabCursor={true}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        modules={[Virtual, Autoplay]}
        className="mySwiper"
        virtual
        style={{ willChange: "transform" }}
      >
        {moviesWithGenres?.map((movie, idx) => {
          return (
            <SwiperSlide
              key={movie.id}
              virtualIndex={idx}
              style={{ willChange: "transform" }}
              className="transition-[transform,opacity] transform-gpu"
            >
              {({ isActive }) => (
                <HomeSliderContent
                  movie={movie}
                  isActive={isActive}
                  genreNames={movie.genreNames}
                />
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default memo(HomeSlider, (prevProps, nextProps) => {
  // Custom comparison function to prevent unnecessary re-renders
  return shallowEqual(prevProps, nextProps);
});
