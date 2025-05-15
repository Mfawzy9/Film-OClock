import {
  MovieImagesResponse,
  TvImagesResponse,
} from "@/app/interfaces/apiInterfaces/imagesInterfaces";
import { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { openImgModal } from "@/lib/Redux/localSlices/imgModalSlice";
import useIsArabic from "@/app/hooks/useIsArabic";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import { FaChevronLeft } from "@react-icons/all-files/fa/FaChevronLeft";
import { FaChevronRight } from "@react-icons/all-files/fa/FaChevronRight";

interface ImgsSliderProps {
  images: MovieImagesResponse | TvImagesResponse;
  name: string;
}

interface ImgCardProps {
  img: { file_path: string };
  index: number;
  openModal: (index: number) => void;
  idx: number;
  name: string;
  dispatch: AppDispatch;
}

const ImgCard = memo(
  ({ img, index, openModal, idx, name, dispatch }: ImgCardProps) => {
    const isImgLoaded = useSelector(
      (state: RootState) =>
        state.imgPlaceholderReducer.loadedImgs?.[img.file_path],
    );
    return (
      <motion.div
        onClick={() => openModal(index + idx)}
        key={img.file_path}
        className="relative w-full rounded-lg cursor-pointer overflow-hidden"
      >
        {!isImgLoaded && <BgPlaceholder />}
        <Image
          width={500}
          height={300}
          src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${img.file_path}`}
          alt={`Backdrop from ${name}`}
          className={`object-cover w-full h-auto aspect-video rounded-lg
            ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
            transition-[transform,opacity] duration-300 transform-gpu ease-out
            lg:hover:scale-110 `}
          priority={index < 3}
          loading={index < 3 ? "eager" : "lazy"}
          onLoad={() => {
            dispatch(setImageLoaded(img.file_path));
          }}
        />
      </motion.div>
    );
  },
);

ImgCard.displayName = "ImgCard";

const ImgsSlider = ({ images, name }: ImgsSliderProps) => {
  const { isArabic } = useIsArabic();
  const dispatch = useDispatch<AppDispatch>();

  const activeImgs = images?.backdrops || [];
  const [index, setIndex] = useState(0);
  const [imagesPerSlide, setImagesPerSlide] = useState(1);
  const [direction, setDirection] = useState(1);

  const imageUrls = activeImgs.map(
    (img) => `https://image.tmdb.org/t/p/original/${img.file_path}`,
  );

  // Function to determine the number of images per slide dynamically
  const getImagesPerSlide = useCallback(() => {
    if (window.innerWidth >= 1600) return 10;
    if (window.innerWidth >= 1024) return 8;
    if (window.innerWidth >= 768) return 6;
    if (window.innerWidth >= 575) return 4;
    return 1;
  }, []);

  // Update imagesPerSlide when the window resizes
  useEffect(() => {
    const updateImagesPerSlide = () => setImagesPerSlide(getImagesPerSlide());
    updateImagesPerSlide(); // Set on mount
    window.addEventListener("resize", updateImagesPerSlide);
    return () => window.removeEventListener("resize", updateImagesPerSlide);
  }, [getImagesPerSlide]);

  const nextSlide = () => {
    setDirection(1); // Moving right
    setIndex((prev) => (prev + imagesPerSlide) % activeImgs.length);
  };

  const prevSlide = () => {
    setDirection(-1); // Moving left
    setIndex(
      (prev) => (prev - imagesPerSlide + activeImgs.length) % activeImgs.length,
    );
  };

  const openModal = (imgIndex: number) => {
    dispatch(openImgModal({ images: imageUrls, index: imgIndex }));
  };

  return (
    <>
      {images?.backdrops?.length === 0 || !images?.backdrops ? (
        <p className="text-center text-2xl font-bold">
          {isArabic ? "لم يتم العثور على صور" : "No Images Found"}
        </p>
      ) : (
        <div className="relative w-full max-w-6xl mx-auto mt-6">
          {/* Slider Container */}
          <div className="relative flex items-center justify-center">
            {/* Prev Button */}
            <button
              onClick={prevSlide}
              className="absolute left-0 sm:-left-6 xl:-left-12 2xl:-left-16 top-1/2 -translate-y-1/2
                z-10 p-2 bg-black/60 text-white rounded-full hover:bg-gray-800 transition
                [box-shadow:0_0_5px_#1c64f2]"
            >
              <FaChevronLeft className="text-2xl sm:text-3xl" />
            </button>

            {/* Images Grid */}
            <div className="overflow-hidden w-full">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: direction * 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 100 }}
                  transition={{ duration: 0.2 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x;

                    if (swipe < -1000) {
                      nextSlide();
                    } else if (swipe > 1000) {
                      prevSlide();
                    }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 3xl:grid-cols-5
                    gap-4 grid-rows-1 sm:grid-rows-2"
                >
                  {activeImgs
                    .slice(index, index + imagesPerSlide)
                    .map((img, idx) => {
                      return (
                        <ImgCard
                          key={img.file_path}
                          img={img}
                          name={name}
                          index={index}
                          idx={idx}
                          openModal={openModal}
                          dispatch={dispatch}
                        />
                      );
                    })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="absolute right-0 sm:-right-6 xl:-right-12 2xl:-right-16 top-1/2 -translate-y-1/2
                z-10 p-2 bg-black/60 text-white rounded-full hover:bg-gray-800 transition
                shadow-blueGlow"
            >
              <FaChevronRight className="text-2xl sm:text-3xl" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(ImgsSlider);
