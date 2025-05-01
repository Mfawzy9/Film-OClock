import { Swiper, SwiperSlide } from "swiper/react";
import PageSection from "../PageSection/PageSection";
import { memo } from "react";

const VideosSkelsetonSlider = () => {
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
            spaceBetween={20}
            slidesPerView={1}
            slidesPerGroup={1}
            breakpoints={{
              575: { slidesPerView: 2, spaceBetween: 10 },
              768: { slidesPerView: 3, spaceBetween: 10 },
              1024: { slidesPerView: 4, spaceBetween: 10 },
              1280: { slidesPerView: 4, spaceBetween: 10 },
              1600: { slidesPerView: 5, spaceBetween: 10 },
            }}
            autoHeight={false}
            watchSlidesProgress={false}
            watchOverflow={false}
            preventInteractionOnTransition={true}
            className="!py-5 !px-2"
          >
            {[...Array(5)].map((_, idx) => (
              <SwiperSlide key={idx} className="">
                <div className="cursor-pointer group overflow-hidden bg-gray-800 rounded-md p-1 animate-pulse">
                  {/* Video thumbnail placeholder */}
                  <div className="relative aspect-video bg-gray-700 rounded-md overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 bg-gray-600 rounded-full"></div>
                    </div>
                    {/* Duration placeholder */}
                    <div className="absolute bottom-0 end-0 bg-gray-600/80 py-1 px-2 h-6 w-16"></div>
                  </div>
                  {/* Title placeholder */}
                  <div className="mt-2 h-5 bg-gray-700 rounded w-3/4 ps-2"></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation buttons skeleton */}
          <div
            className="absolute start-0 sm:-start-6 2xl:-start-16 top-1/2 -translate-y-1/2 z-10 p-2
              bg-gray-700 rounded-full"
          >
            <div className="text-2xl sm:text-3xl text-transparent">→</div>
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

export default memo(VideosSkelsetonSlider);
