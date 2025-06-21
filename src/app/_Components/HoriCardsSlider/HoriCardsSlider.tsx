"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Autoplay, Virtual } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { AnimatePresence } from "framer-motion";
import debounce from "lodash/debounce";
import HoriCard from "../HoriCard/HoriCard";
import PageSection from "../PageSection/PageSection";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import SlidersTitle from "../SlidersTitle/SlidersTitle";
import useIsArabic from "@/app/hooks/useIsArabic";
import Image from "next/image";
import { getShowTitle } from "../../../../helpers/helpers";
import MotionWrapper from "../helpers/MotionWrapper";
import { FaChevronLeft } from "@react-icons/all-files/fa/FaChevronLeft";
import { FaChevronRight } from "@react-icons/all-files/fa/FaChevronRight";
import dynamic from "next/dynamic";
import useIsDesktop from "@/app/hooks/useIsDesktop";

const HoriSkeletonSlider = dynamic(() => import("./HoriSkeletonSlider"));

const sectionBgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280;

const bgVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } },
};

interface HoriCardsSliderProps {
  sliderType: "movie" | "tv";
  data: Movie[] | TVShow[];
  title: string;
  pageLink: string;
  isLoading?: boolean;
}

const HoriCardsSlider = ({
  sliderType,
  data,
  title,
  pageLink,
  isLoading,
}: HoriCardsSliderProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [activeBackdrop, setActiveBackdrop] = useState<string | null>(null);
  const { isArabic } = useIsArabic();
  const isDesktop = useIsDesktop();

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

  const debouncedSetBackdrop = useMemo(
    () =>
      debounce((backdropUrl: string) => {
        setActiveBackdrop(backdropUrl);
      }, 200),
    [],
  );

  const handleSlideChange = useCallback(
    (swiper: SwiperType) => {
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);

      const activeIndex = swiper.activeIndex;
      const newBackdrop = data[activeIndex]?.backdrop_path
        ? `${sectionBgUrl}${data[activeIndex].backdrop_path}`
        : null;

      if (newBackdrop) {
        debouncedSetBackdrop(newBackdrop);
      }
    },
    [data, debouncedSetBackdrop],
  );

  useEffect(() => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  }, [data]);

  useEffect(() => {
    if (data?.length > 0 && data?.[0]?.backdrop_path && !activeBackdrop) {
      const initialBackdrop = `${sectionBgUrl}${data[0].backdrop_path}`;
      setActiveBackdrop(initialBackdrop);
    }
  }, [data, activeBackdrop]);

  useEffect(() => {
    return () => {
      debouncedSetBackdrop.cancel();
    };
  }, [debouncedSetBackdrop]);

  if (isLoading) {
    return <HoriSkeletonSlider />;
  }

  return (
    <section className="mt-10 relative">
      {/* Gradient overlays */}
      <div
        className="before:content-[''] before:absolute before:-top-1 before:left-0 before:w-full
          before:h-12 before:bg-gradient-to-b before:from-black before:to-transparent
          before:z-10"
      />
      <div
        className="after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full
          after:h-20 after:bg-gradient-to-t after:from-black after:to-transparent
          after:z-10"
      />

      {/* Background Transition */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <AnimatePresence>
          {activeBackdrop && (
            <MotionWrapper
              isDesktop={isDesktop}
              motionProps={{
                variants: bgVariants,
                initial: "hidden",
                animate: "visible",
                exit: "exit",
                key: activeBackdrop,
              }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-black/70 z-10" />
              <Image
                src={activeBackdrop}
                alt="Slider background"
                fill
                className="object-cover object-center"
                quality={2}
                sizes="100vw"
                priority={data
                  .slice(0, 5)
                  .some(
                    (item) =>
                      activeBackdrop === `${sectionBgUrl}${item.backdrop_path}`,
                  )}
              />
            </MotionWrapper>
          )}
        </AnimatePresence>
      </div>

      <PageSection className="!py-16">
        <SlidersTitle pageLink={pageLink} title={title} />

        <div className="relative z-10">
          <Swiper
            onInit={handleSwiper}
            onSlideChange={handleSlideChange}
            onSwiper={handleSwiper}
            modules={[Virtual, Autoplay]}
            autoplay={{
              delay: 10000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={20}
            slidesPerView={1}
            slidesPerGroup={1}
            breakpoints={{
              575: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 2, spaceBetween: 10 },
              1024: { slidesPerView: 3, spaceBetween: 10 },
              1280: { slidesPerView: 4, spaceBetween: 10 },
            }}
            navigation={false}
            virtual
            lazyPreloadPrevNext={2}
            className="!pt-5 !pb-12 !px-1"
          >
            {data?.slice(0, 20).map((theShow, idx) => {
              if (!theShow.backdrop_path) return null;
              const title =
                getShowTitle({
                  show: theShow,
                  isArabic,
                }) ||
                (theShow as Movie).original_title ||
                (theShow as TVShow).name ||
                (theShow as TVShow).original_name;
              const date =
                (theShow as Movie).release_date ||
                (theShow as TVShow).first_air_date;
              const backdropUrl = `${sectionBgUrl}${theShow.backdrop_path}`;

              return (
                <SwiperSlide
                  key={idx}
                  virtualIndex={idx}
                  className="!flex !justify-center"
                >
                  <HoriCard
                    isArabic={isArabic}
                    theShow={theShow}
                    idx={idx}
                    backdrop_path={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${theShow.backdrop_path}`}
                    date={date}
                    title={title}
                    showId={theShow.id}
                    showType={sliderType}
                    rating={theShow.vote_average}
                    genresIds={theShow.genre_ids}
                    onHover={() => {
                      debouncedSetBackdrop(backdropUrl);
                    }}
                    isActive={activeBackdrop === backdropUrl}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>

          {!isBeginning && (
            <button
              onClick={() => handleNavigate("prev")}
              aria-label="Previous slide"
              className="absolute start-0 sm:-start-6 2xl:-start-16 top-1/2 -translate-y-1/2 z-10 p-2
                bg-black/60 text-white rounded-full hover:bg-gray-800 transition shadow-blueGlow"
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
      </PageSection>
    </section>
  );
};

export default HoriCardsSlider;
