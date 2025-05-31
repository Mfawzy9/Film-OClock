"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import PageSection from "../PageSection/PageSection";

const HoriSkeletonSlider = () => {
  return (
    <section
      className="mt-10 relative before:content-[''] before:absolute before:-top-1 before:left-0
        before:w-full before:h-12 before:bg-gradient-to-b before:from-black
        before:to-transparent after:content-[''] after:absolute after:-bottom-1
        after:left-0 after:w-full after:h-20 after:bg-gradient-to-t after:from-black
        after:to-transparent"
    >
      {/* Dark background for skeleton */}
      <div className="absolute inset-0 -z-10 bg-gray-900"></div>

      <PageSection className="!py-16">
        {/* Title skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-1/4 bg-gray-700 rounded animate-pulse"></div>
        </div>

        {/* Slider skeleton using Swiper */}
        <div className="relative z-10">
          <Swiper
            spaceBetween={20}
            slidesPerView={1}
            slidesPerGroup={1}
            breakpoints={{
              575: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 2, spaceBetween: 10 },
              1024: { slidesPerView: 3, spaceBetween: 10 },
              1280: { slidesPerView: 4, spaceBetween: 10 },
            }}
            autoHeight={false}
            watchSlidesProgress={false}
            watchOverflow={false}
            preventInteractionOnTransition={true}
            className="!py-5 !px-1"
          >
            {[...Array(5)].map((_, index) => (
              <SwiperSlide key={index} className="!flex !justify-center">
                <div
                  className="rounded-md w-[450px] h-[190px] sm:h-[160px] md:h-[250px] lg:h-[200px]
                    xl:h-[180px] 3xl:h-[150px] bg-gray-800 animate-pulse relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent flex
                      flex-col justify-end gap-2 p-3"
                  >
                    <div className="h-4 w-1/2 bg-gray-700 rounded" />
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <div className="h-3 w-10 bg-gray-700 rounded" />
                        <div className="h-3 w-10 bg-gray-700 rounded" />
                      </div>
                      <div className="h-3 w-20 bg-gray-700 rounded" />
                    </div>
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
            <div className="text-2xl sm:text-3xl text-transparent">→</div>
          </div>
        </div>
      </PageSection>
    </section>
  );
};

export default HoriSkeletonSlider;
