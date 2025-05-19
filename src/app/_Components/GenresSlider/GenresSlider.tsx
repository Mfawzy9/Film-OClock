import { memo, useCallback, useEffect, useRef, useState } from "react";
import PageSection from "../PageSection/PageSection";
import { Link } from "@/i18n/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";
import { Swiper as SwiperType } from "swiper";
import { genre } from "@/app/interfaces/apiInterfaces/genresInterfaces";
import Image from "next/image";
import SlidersTitle from "../SlidersTitle/SlidersTitle";
import useIsArabic from "@/app/hooks/useIsArabic";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import { FaChevronLeft } from "@react-icons/all-files/fa/FaChevronLeft";
import { FaChevronRight } from "@react-icons/all-files/fa/FaChevronRight";
import dynamic from "next/dynamic";

const GenresSkeletonSlider = dynamic(() => import("./GenresSkeletonSlider"));

interface GenresSliderProps {
  pageLink: string;
  title: string;
  genresList: genre[];
  genresBackdrops: Map<number, string>;
  showType: "movie" | "tv";
  isLoading: boolean;
}

const GenreCard = memo(
  ({
    genre,
    backdropPath,
    idx,
    showType,
  }: {
    genre: genre;
    backdropPath: string;
    idx: number;
    showType: "movie" | "tv";
  }) => {
    const dispatch = useDispatch<AppDispatch>();

    const isImgLoaded = useSelector(
      (state: RootState) =>
        state.imgPlaceholderReducer.loadedImgs[backdropPath],
      shallowEqual,
    );
    return (
      <Link
        href={
          showType === "movie"
            ? `/shows/all/movie?page=1&genre=${genre.id}&genreName=${genre.name}`
            : `/shows/all/tv?page=1&genre=${genre.id}&genreName=${genre.name}`
        }
        className={`relative group block overflow-hidden rounded-xl shadow-blueGlow shadow-white
          lg:hover:shadow-blueGlow transition-shadow duration-700 xs:w-[250] sm:w-auto
          mx-auto`}
      >
        {!isImgLoaded && <BgPlaceholder />}
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W200}${backdropPath}`}
          loading={idx < 3 ? "eager" : "lazy"}
          priority={idx < 3}
          alt={genre.name}
          width={350}
          height={200}
          className={`w-full h-full object-cover lg:group-hover:scale-150 transition-transform
            lg:group-hover:-rotate-12
            ${isImgLoaded ? "opacity-100 scale-100 duration-1000" : "opacity-0 scale-90 duration-300"}
            transition-[transform,opacity] transform-gpu ease-out`}
          onLoad={() => dispatch(setImageLoaded(backdropPath))}
        />

        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
          <h3
            className="text-2xl font-sans text-center font-bold text-white mt-2 lg:group-hover:scale-75
              transition-transform duration-1000 lg:group-hover:-rotate-12"
          >
            {genre.name}
          </h3>
        </div>
      </Link>
    );
  },
);

GenreCard.displayName = "GenreCard";

const GenresSlider = ({
  genresList,
  title,
  pageLink,
  genresBackdrops,
  showType,
  isLoading,
}: GenresSliderProps) => {
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
  }, [genresList]);

  if (isLoading) {
    return <GenresSkeletonSlider />;
  }

  if (!genresList) return null;

  return (
    <section>
      {/* Background Transition */}
      <PageSection className="!py-10">
        {/* Title and link */}
        <SlidersTitle title={title} pageLink={pageLink} />

        {/* Slider */}
        <div className="relative">
          <Swiper
            onInit={handleSwiper}
            onSlideChange={handleSlideChange}
            onSwiper={handleSwiper}
            modules={[Virtual]}
            spaceBetween={30}
            slidesPerView={1}
            slidesPerGroup={1}
            breakpoints={{
              575: { slidesPerView: 2, spaceBetween: 30, slidesPerGroup: 2 },
              768: { slidesPerView: 3, spaceBetween: 30, slidesPerGroup: 3 },
              1024: { slidesPerView: 4, spaceBetween: 30, slidesPerGroup: 4 },
              1280: { slidesPerView: 4, spaceBetween: 30, slidesPerGroup: 4 },
              1600: { slidesPerView: 5, spaceBetween: 30, slidesPerGroup: 5 },
            }}
            navigation={false}
            virtual
            lazyPreloadPrevNext={2}
            className="!py-5 !px-10"
          >
            {genresList?.map((genre, idx) => {
              const backdropPath = genresBackdrops.get(genre.id);
              if (!backdropPath) return null;

              return (
                <SwiperSlide key={idx} virtualIndex={idx}>
                  <GenreCard
                    showType={showType}
                    key={genre.id}
                    genre={genre}
                    backdropPath={backdropPath}
                    idx={idx}
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
    </section>
  );
};

export default GenresSlider;
