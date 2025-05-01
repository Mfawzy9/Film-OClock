import { Swiper, SwiperSlide } from "swiper/react";

const CardsSkeletonSlider = ({
  className,
  arrLength = 6,
}: {
  className?: string;
  arrLength?: number;
}) => {
  return (
    <section className={className}>
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-1/4 bg-gray-700 rounded animate-pulse"></div>
      </div>
      <div className="relative">
        <Swiper
          breakpoints={{
            575: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 },
            1536: { slidesPerView: 6 },
          }}
          autoHeight={false}
          watchSlidesProgress={false}
          watchOverflow={false}
          preventInteractionOnTransition={true}
          spaceBetween={10}
          className="pb-5"
        >
          {[...Array(arrLength)].map((_, index) => (
            <SwiperSlide
              key={index}
              className="!flex !justify-center md:!justify-start"
            >
              <div className="relative overflow-hidden pb-1 w-[235px] animate-pulse">
                {/* Image Placeholder */}
                <div className="h-[350px] xl:h-[300px] bg-gray-700 rounded-sm" />

                {/* Text Placeholder */}
                <div className="mt-2 px-1">
                  <div className="h-5 bg-gray-700 rounded w-3/4 mb-2" />
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-700 rounded w-1/3" />
                    <div className="flex items-center gap-1">
                      <div className="h-4 w-4 bg-gray-700 rounded-full" />
                      <div className="h-4 bg-gray-700 rounded w-6" />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default CardsSkeletonSlider;
