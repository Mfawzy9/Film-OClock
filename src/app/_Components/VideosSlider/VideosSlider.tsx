"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import TrailerCard from "./TrailerCard";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import PageSection from "../PageSection/PageSection";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Virtual } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { useLazyGetVideosQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { VideosResults } from "@/app/interfaces/apiInterfaces/videosInterfaces";
import SlidersTitle from "../SlidersTitle/SlidersTitle";
import useIsArabic from "@/app/hooks/useIsArabic";
import VideosSkelsetonSlider from "./VideosSkelsetonSlider";
import { FaChevronLeft } from "@react-icons/all-files/fa/FaChevronLeft";
import { FaChevronRight } from "@react-icons/all-files/fa/FaChevronRight";

interface VideoResult {
  showId: number;
  showName: string;
  showType: "movie" | "tv";
  trailers: VideosResults[];
}

interface VideosSliderProps {
  theShows: Movie[] | TVShow[];
  showType: "movie" | "tv";
  title: string;
  pageLink: string;
  getVideos: ReturnType<typeof useLazyGetVideosQuery>[0];
  isLoading?: boolean;
}

const VideosSlider = ({
  theShows,
  showType,
  title,
  pageLink,
  getVideos,
  isLoading,
}: VideosSliderProps) => {
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

  const [videosResults, setVideosResults] = useState<VideoResult[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const results = await Promise.all(
          theShows?.map(async (theShow) => {
            const res = await getVideos(
              {
                showId: theShow.id,
                showType,
              },
              true,
            ).unwrap();
            return {
              showId: theShow.id,
              showName:
                (theShow as Movie).title ||
                (theShow as Movie).original_title ||
                (theShow as TVShow).name ||
                (theShow as TVShow).original_name,
              showType,
              trailers:
                res?.results?.filter((video) => video.type === "Trailer") || [],
            };
          }),
        );
        setVideosResults(results);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };

    if (theShows?.length > 0) {
      fetchVideos();
    }
  }, [theShows, getVideos, showType]);

  useEffect(() => {
    if (swiperRef.current) {
      setIsBeginning(swiperRef.current.isBeginning);
      setIsEnd(swiperRef.current.isEnd);
    }
  }, [theShows, videosResults]);

  if (isLoading || !videosResults) {
    return <VideosSkelsetonSlider />;
  }

  if (!theShows) return null;

  return (
    <PageSection
      className="!py-10 min-h-[350px] xs:min-h-[500px] sm:min-h-[400px] md:min-h-[380px] flex
        flex-col justify-center"
    >
      {/* Title and link */}
      <SlidersTitle pageLink={pageLink} title={title} />

      {/* Slider */}
      <div className="relative">
        <Swiper
          onInit={handleSwiper}
          onSlideChange={handleSlideChange}
          onSwiper={handleSwiper}
          modules={[Virtual, Autoplay]}
          autoplay={{ delay: 12000, disableOnInteraction: false }}
          spaceBetween={20}
          slidesPerView={1}
          slidesPerGroup={1}
          breakpoints={{
            575: { slidesPerView: 2, spaceBetween: 10, slidesPerGroup: 2 },
            768: { slidesPerView: 3, spaceBetween: 10, slidesPerGroup: 3 },
            1024: { slidesPerView: 4, spaceBetween: 10, slidesPerGroup: 4 },
            1600: { slidesPerView: 5, spaceBetween: 10, slidesPerGroup: 5 },
          }}
          navigation={false}
          virtual
          lazyPreloadPrevNext={2}
          className="!py-5 !px-2"
        >
          {videosResults?.map((theShow, idx) => {
            if (theShow.trailers.length > 0)
              return (
                <SwiperSlide key={idx} virtualIndex={idx} className="">
                  <TrailerCard
                    name={theShow.showName}
                    showId={theShow.showId}
                    showType={showType}
                    videoKey={theShow.trailers[0].key}
                  />
                </SwiperSlide>
              );
          })}
        </Swiper>

        {/* Navigation buttons */}
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
  );
};

export default VideosSlider;
