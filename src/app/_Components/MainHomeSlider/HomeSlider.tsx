"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Virtual } from "swiper/modules";
import { Swiper as SwiperType } from "swiper/types";
import HomeSliderContent from "./HomeSliderContent";
import { memo, useEffect, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { MoviesTrendsResponse } from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import dynamic from "next/dynamic";
import { GenresResponse } from "@/app/interfaces/apiInterfaces/genresInterfaces";
import ScrollToSection from "../ScrollToSection/ScrollToSection";
import { setSliderRendered } from "@/lib/Redux/localSlices/hasRenderedSlice";
import type { RootState } from "@/lib/Redux/store";

const HomeSliderSkeleton = dynamic(() => import("./HomeSliderSkeleton"));

const HomeSlider = ({
  data,
  genres,
}: {
  data: MoviesTrendsResponse;
  genres: GenresResponse | null;
}) => {
  const dispatch = useDispatch();
  const hasRendered = useSelector(
    (state: RootState) => state.homeReducer.hasSliderRendered,
    shallowEqual,
  );

  useEffect(() => {
    if (!hasRendered) {
      dispatch(setSliderRendered(true));
    }
  }, [hasRendered, dispatch]);

  const isOpen = useSelector(
    (state: RootState) => state.videoModalReducer.isOpen,
    (prev, next) => prev === next,
  );
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(
    null as SwiperType | null,
  );

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
    if (!swiperInstance) return;

    swiperInstance.autoplay?.[isOpen ? "stop" : "start"]();
  }, [isOpen, swiperInstance]);

  return (
    <>
      <ScrollToSection reference={null} />

      {!hasRendered ? (
        <HomeSliderSkeleton />
      ) : (
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
          virtual={{
            cache: true,
          }}
          style={{ willChange: "transform" }}
        >
          {moviesWithGenres?.map((movie, idx) => {
            return (
              <SwiperSlide
                key={movie.id}
                virtualIndex={idx}
                style={{ willChange: "transform" }}
                className="transition-[transform,opacity] transform-gpu relative"
              >
                {({ isActive, isVisible }) => (
                  <HomeSliderContent
                    movie={movie}
                    isActive={isActive}
                    isVisible={isVisible}
                    genreNames={movie?.genreNames || []}
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
