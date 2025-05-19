"use client";
import { memo } from "react";
import PageSection from "../PageSection/PageSection";
import { Swiper, SwiperSlide } from "swiper/react";

const GenresSkeletonSlider = () => {
  return (
    <section>
      <PageSection className="!py-10">
        {/* Title skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-1/4 bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Slider skeleton */}
        <div className="relative">
          <Swiper
            modules={[]}
            spaceBetween={30}
            slidesPerView={1}
            slidesPerGroup={1}
            breakpoints={{
              575: { slidesPerView: 2, spaceBetween: 30 },
              768: { slidesPerView: 3, spaceBetween: 30 },
              1024: { slidesPerView: 4, spaceBetween: 30 },
              1280: { slidesPerView: 4, spaceBetween: 30 },
              1600: { slidesPerView: 5, spaceBetween: 30 },
            }}
            autoHeight={false}
            watchSlidesProgress={false}
            watchOverflow={false}
            preventInteractionOnTransition={true}
            className="!py-5 !px-10"
          >
            {[...Array(5)].map((_, idx) => (
              <SwiperSlide key={idx}>
                <div
                  className="relative group block overflow-hidden rounded-xl shadow-lg shadow-gray-700/50
                    w-[216px] h-[130px] mx-auto animate-pulse"
                >
                  {/* Image placeholder */}
                  <div className="absolute inset-0 bg-gray-700"></div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gray-800/70 flex flex-col items-center justify-center">
                    {/* Genre name placeholder */}
                    <div className="h-8 w-3/4 bg-gray-600 rounded"></div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons skeleton */}
          <div
            className="absolute start-0 sm:-start-6 2xl:-start-16 top-1/2 -translate-y-1/2 z-10 p-2
              bg-gray-700 rounded-full"
          >
            <div className="text-2xl sm:text-3xl text-transparent">←</div>
          </div>
          <div
            className="absolute end-0 sm:-end-6 2xl:-end-16 top-1/2 -translate-y-1/2 z-10 p-2
              bg-gray-700 rounded-full"
          >
            <div className="text-2xl sm:text-3xl text-transparent">←</div>
          </div>
        </div>
      </PageSection>
    </section>
  );
};

export default memo(GenresSkeletonSlider);
