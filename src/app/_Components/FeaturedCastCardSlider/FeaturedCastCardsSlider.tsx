"use client";
import { PopularPersonI } from "@/app/interfaces/apiInterfaces/popularMoviesTvInterfaces";
import { Autoplay, Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import FeaturedCastCard from "../FeaturedCastCard/FeaturedCastCard";
import Title from "../Title/Title";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import useIsArabic from "@/app/hooks/useIsArabic";
import { FaChevronLeft } from "@react-icons/all-files/fa/FaChevronLeft";
import { FaChevronRight } from "@react-icons/all-files/fa/FaChevronRight";
import dynamic from "next/dynamic";

const FeaturedCastCardsSkeletonSlider = dynamic(
  () => import("./FeaturedCastCardsSkeletonSlider"),
);

const FeaturedCastCardsSlider = ({
  featuredCast,
  isLoading,
}: {
  featuredCast: PopularPersonI[];
  isLoading?: boolean;
}) => {
  const t = useTranslations("PopularPeople");
  const { isArabic } = useIsArabic();
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  const handleNavigate = useCallback(
    (direction: "next" | "prev") =>
      direction === "prev"
        ? swiperRef.current?.slidePrev()
        : swiperRef.current?.slideNext(),
    [],
  );

  const handleSwiper = useCallback((swiper: SwiperType) => {
    swiperRef.current = swiper;
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  useEffect(() => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  }, [featuredCast]);

  if (isLoading) return <FeaturedCastCardsSkeletonSlider />;

  return (
    <>
      <main>
        <div
          className="italic animate-pulse mx-auto lg:mx-0 w-fit relative after:content-['']
            after:animate-bounce after:absolute after:-bottom-3 after:start-0 after:w-14
            lg:after:h-1 after:bg-blue-800"
        >
          <Title title={t("featuredCast.title")} />
        </div>
        <div className="relative">
          <Swiper
            onInit={handleSwiper}
            onSlideChange={handleSlideChange}
            onSwiper={handleSwiper}
            modules={[Virtual, Autoplay]}
            autoplay={{
              delay: 12000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={20}
            slidesPerView={1}
            slidesPerGroup={1}
            breakpoints={{
              575: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              768: {
                slidesPerView: 3,
                spaceBetween: 10,
              },
              1280: { slidesPerView: 4, spaceBetween: 10 },
              2400: { slidesPerView: 5, spaceBetween: 10 },
            }}
            navigation={false}
            virtual
            lazyPreloadPrevNext={2}
            className="!py-5 !px-1"
          >
            {featuredCast?.map((person, index) => (
              <SwiperSlide key={person.id} virtualIndex={index}>
                <FeaturedCastCard person={person} t={t} />
              </SwiperSlide>
            ))}
          </Swiper>

          {!isBeginning && (
            <button
              onClick={() => handleNavigate("prev")}
              aria-label="Previous slide"
              className={`absolute start-0 sm:-start-6 2xl:-start-16 top-1/2 -translate-y-1/2 z-10 p-2
              bg-black/60 text-white rounded-full hover:bg-gray-800 transition
              shadow-blueGlow `}
            >
              {isArabic ? (
                <FaChevronRight className="text-2xl sm:text-3xl" />
              ) : (
                <FaChevronLeft className="text-2xl sm:text-3xl" />
              )}
            </button>
          )}

          {!isEnd && (
            <button
              onClick={() => handleNavigate("next")}
              aria-label="Next slide"
              className="absolute end-0 sm:-end-6 2xl:-end-16 top-1/2 -translate-y-1/2 z-10 p-2
                bg-black/60 text-white rounded-full hover:bg-gray-800 transition shadow-blueGlow"
            >
              {isArabic ? (
                <FaChevronLeft className="text-2xl sm:text-3xl" />
              ) : (
                <FaChevronRight className="text-2xl sm:text-3xl" />
              )}
            </button>
          )}
        </div>
      </main>
    </>
  );
};

export default FeaturedCastCardsSlider;
