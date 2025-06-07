"use client";
import { useRef, useMemo, memo, useCallback, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Swiper as SwiperType } from "swiper";
import { Autoplay, Virtual } from "swiper/modules";
import SliderCard from "../SliderCard/SliderCard";
import Title from "../Title/Title";
import { SearchPerson } from "@/app/interfaces/apiInterfaces/searchPersonInterfaces";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { removeDuplicatesById } from "../../../../helpers/helpers";
import { FirestoreTheShowI } from "@/app/hooks/useLibrary";
import SlidersTitle from "../SlidersTitle/SlidersTitle";
import { useTranslations } from "next-intl";
import useIsArabic from "@/app/hooks/useIsArabic";
import { FaChevronLeft } from "@react-icons/all-files/fa/FaChevronLeft";
import { FaChevronRight } from "@react-icons/all-files/fa/FaChevronRight";
import dynamic from "next/dynamic";
import { FaCircle } from "@react-icons/all-files/fa/FaCircle";

const CardsSkeletonSlider = dynamic(() => import("./CardsSkeletonSlider"));

type TheShows = Movie[] | TVShow[] | SearchPerson[] | FirestoreTheShowI[];

interface CardsSliderProps {
  theShows: TheShows;
  showType: "movie" | "tv" | "person";
  sliderType: "movies" | "tvShows" | "People";
  className?: string;
  title?: string;
  pageLink?: string;
  isLoading?: boolean;
  arrLength?: number;
  autoPlay?: boolean;
}

const CardsSlider = ({
  theShows,
  showType,
  sliderType,
  title,
  className,
  pageLink,
  isLoading,
  arrLength,
  autoPlay = true,
}: CardsSliderProps) => {
  const t = useTranslations("HomePage");
  const { isArabic } = useIsArabic();
  const swiperRef = useRef<SwiperType | null>(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [isSwiperReady, setIsSwiperReady] = useState(false);

  const handleNavigate = useCallback(
    (direction: "next" | "prev") =>
      direction === "prev"
        ? swiperRef.current?.slidePrev()
        : swiperRef.current?.slideNext(),
    [],
  );

  useEffect(() => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  }, [theShows]);

  const handleSwiper = useCallback(
    (swiper: SwiperType) => {
      swiperRef.current = swiper;
      setIsBeginning(swiper.isBeginning);
      setIsEnd(swiper.isEnd);
      if (!isSwiperReady) setIsSwiperReady(true);
    },
    [isSwiperReady],
  );

  const handleSlideChange = useCallback((swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  }, []);

  const sliderData = useMemo(() => {
    if (!theShows) return [];
    switch (sliderType) {
      case "movies":
        return (theShows as Movie[]) ?? [];
      case "tvShows":
        return (theShows as TVShow[]) ?? [];
      case "People":
        return (theShows as SearchPerson[]) ?? [];
      default:
        return [];
    }
  }, [theShows, sliderType]);

  const filtered = useMemo(() => {
    return removeDuplicatesById({ items: sliderData });
  }, [sliderData]);

  useEffect(() => {
    setIsSwiperReady(true);
  }, []);

  if (isLoading) {
    return <CardsSkeletonSlider arrLength={arrLength} className={className} />;
  }

  if (!filtered.length || !sliderData.length) return null;

  return (
    <section
      className={`${className ?? ""} ${!isSwiperReady && "min-h-[465px]"} `}
    >
      {!isSwiperReady ? (
        <div className="flex items-center h-full min-h-[465px]">
          <FaCircle className="text-6xl mx-auto animate-ping text-blue-300" />
        </div>
      ) : (
        <>
          {pageLink ? (
            <SlidersTitle title={title} pageLink={pageLink} />
          ) : (
            <Title title={title ?? ""} />
          )}
        </>
      )}
      <div className="relative">
        <Swiper
          touchStartPreventDefault={false}
          onInit={handleSwiper}
          onSlideChange={handleSlideChange}
          onSwiper={handleSwiper}
          modules={[Virtual, Autoplay]}
          autoplay={
            autoPlay
              ? {
                  delay: 12000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                  stopOnLastSlide: false,
                  waitForTransition: true,
                }
              : false
          }
          spaceBetween={10}
          slidesPerView={1}
          slidesPerGroup={1}
          breakpoints={{
            575: {
              slidesPerView: 2,
              spaceBetween: 0,
              slidesPerGroup: 2,
              centerInsufficientSlides: true,
              centeredSlidesBounds: true,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 10,
              slidesPerGroup: 3,
              centerInsufficientSlides: false,
              centeredSlidesBounds: false,
            },
            1024: { slidesPerView: 4, spaceBetween: 5, slidesPerGroup: 4 },
            1280: { slidesPerView: 5, spaceBetween: 10, slidesPerGroup: 5 },
            1536: { slidesPerView: 6, spaceBetween: 10, slidesPerGroup: 6 },
          }}
          navigation={false}
          virtual
          lazyPreloadPrevNext={2}
          className="pb-5"
        >
          {filtered.map((item, idx) => {
            //for movies and tv
            if (showType !== "person" && !("posterPath" in item)) {
              if (!("poster_path" in item && item.poster_path)) return null;
            }
            //for people
            if (
              showType === "person" &&
              title === t("PopularCelebritiesSliderTitle")
            ) {
              if (!("profile_path" in item && item.profile_path)) return null;
            }

            const name =
              ("showType" in item && (item as FirestoreTheShowI).title) ||
              (item as Movie).title ||
              (item as Movie).original_title ||
              (item as TVShow).name ||
              (item as TVShow | SearchPerson).original_name ||
              "";

            const releaseDate =
              (item as FirestoreTheShowI).releaseDate ||
              (item as Movie).release_date ||
              (item as TVShow).first_air_date ||
              "";

            const poster =
              (item as FirestoreTheShowI).posterPath ||
              (item as Movie | TVShow).poster_path ||
              (item as SearchPerson).profile_path ||
              "";

            const rating =
              (item as FirestoreTheShowI).rating ||
              (item as Movie | TVShow).vote_average ||
              (item as SearchPerson).popularity ||
              0;

            const personJob = (item as SearchPerson).known_for_department || "";

            const theShow =
              showType !== "person"
                ? (item as Movie | TVShow | FirestoreTheShowI)
                : "";

            const updatedShowType =
              "showType" in item ? item.showType : showType;

            return (
              <SwiperSlide
                key={item.id}
                virtualIndex={idx}
                className="!flex !justify-center md:!justify-start"
              >
                <SliderCard
                  idx={idx}
                  theShow={theShow as Movie | TVShow}
                  srcKey={poster || ""}
                  alt={name}
                  showType={updatedShowType}
                  id={item.id}
                  name={name}
                  release_date={releaseDate}
                  rating={rating}
                  personJob={personJob}
                  isArabic={isArabic}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>

        {!isBeginning && isSwiperReady && (
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

        {!isEnd && isSwiperReady && (
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
    </section>
  );
};

export default memo(CardsSlider);
