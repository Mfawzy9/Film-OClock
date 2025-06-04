import { Swiper, SwiperSlide } from "swiper/react";
import FeaturedCastCardSkeleton from "../FeaturedCastCard/FeaturedCastCardSkeleton";
import { Virtual } from "swiper/modules";

const FeaturedCastCardsSkeletonSlider = () => {
  return (
    <>
      <main>
        <div
          className="italic animate-pulse mx-auto lg:mx-0 w-fit relative after:content-['']
            after:animate-bounce after:absolute after:-bottom-3 after:start-0 after:w-14
            lg:after:h-1 after:bg-blue-800"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="h-8 w-1/4 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="relative">
          <Swiper
            autoplay={{
              delay: 12000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            modules={[Virtual]}
            autoHeight={false}
            watchSlidesProgress={false}
            watchOverflow={false}
            preventInteractionOnTransition={true}
            spaceBetween={20}
            slidesPerView={1}
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
            {[...Array(5)].map((_, index) => (
              <SwiperSlide key={index} virtualIndex={index}>
                <FeaturedCastCardSkeleton />
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            aria-label="Previous slide"
            className="absolute start-0 sm:-start-6 2xl:-start-16 top-1/2 -translate-y-1/2 z-10 p-2
              bg-gray-700/60 text-white rounded-full hover:bg-gray-800 transition
              animate-pulse"
          >
            <div className="w-7 h-7 bg-gray-600 rounded-full" />
          </button>

          <button
            aria-label="Next slide"
            className="absolute end-0 sm:-end-6 2xl:-end-16 top-1/2 -translate-y-1/2 z-10 p-2
              bg-gray-700/60 text-white rounded-full hover:bg-gray-800 transition
              animate-pulse"
          >
            <div className="w-7 h-7 bg-gray-600 rounded-full" />
          </button>
        </div>
      </main>
    </>
  );
};

export default FeaturedCastCardsSkeletonSlider;
