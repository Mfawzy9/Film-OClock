import { useState, useEffect, useCallback, memo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { PImages } from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import { SiSpinrilla } from "react-icons/si";
import useIsArabic from "@/app/hooks/useIsArabic";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";

interface PImgsSliderProps {
  images: PImages;
  name: string;
}

const PersonImgsSlider = ({ images, name }: PImgsSliderProps) => {
  const { isArabic } = useIsArabic();
  const activeImgs = images?.profiles || [];
  const [index, setIndex] = useState(0);
  const [imagesPerSlide, setImagesPerSlide] = useState(1);
  const [direction, setDirection] = useState(1); // 1 for next, -1 for prev
  const [selectedImg, setSelectedImg] = useState<string | null>(null); // Selected image for modal
  const dispatch = useDispatch<AppDispatch>();
  const loadedImgs = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs,
    shallowEqual,
  );

  // Function to determine the number of images per slide dynamically
  const getImagesPerSlide = useCallback(() => {
    if (window.innerWidth >= 1600) return 14;
    if (window.innerWidth >= 1024) return 12;
    if (window.innerWidth >= 768) return 10;
    if (window.innerWidth >= 575) return 6;
    if (window.innerWidth >= 400) return 4;
    return 1;
  }, []);

  // Update imagesPerSlide when the window resizes
  useEffect(() => {
    const updateImagesPerSlide = () => setImagesPerSlide(getImagesPerSlide());
    updateImagesPerSlide(); // Set on mount
    window.addEventListener("resize", updateImagesPerSlide);
    return () => window.removeEventListener("resize", updateImagesPerSlide);
  }, [getImagesPerSlide]);

  const moveSlide = useCallback(
    (direction: "left" | "right") => {
      setDirection(direction === "left" ? -1 : 1);
      setIndex((prev) => {
        const newIndex =
          direction === "left"
            ? (prev - imagesPerSlide + activeImgs.length) % activeImgs.length
            : (prev + imagesPerSlide) % activeImgs.length;
        return newIndex;
      });
    },
    [imagesPerSlide, activeImgs.length],
  );

  return (
    <>
      {images?.profiles?.length === 0 || !images?.profiles ? (
        <p className="text-center text-2xl font-bold">
          {" "}
          {isArabic ? "لم يتم العثور على صور" : "No Images Found"}
        </p>
      ) : (
        <div className="relative w-full max-w-6xl mx-auto mt-6">
          {/* Slider Container */}
          <div className="relative flex items-center justify-center">
            {/* Prev Button */}
            <button
              onClick={() => moveSlide("left")}
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
                  initial={{ opacity: 0, x: direction * 100 }} // Dynamic direction
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -direction * 100 }} // Dynamic direction
                  transition={{ duration: 0.2 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = Math.abs(offset.x) * velocity.x;

                    if (swipe < -1000) {
                      moveSlide("right");
                    } else if (swipe > 1000) {
                      moveSlide("left");
                    }
                  }}
                  className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6
                    3xl:grid-cols-7 gap-4 grid-rows-1 sm:grid-rows-2 place-items-center"
                >
                  {activeImgs
                    .slice(index, index + imagesPerSlide)
                    .map((img) => {
                      const isImgLoaded = loadedImgs[img?.file_path];
                      return (
                        <motion.div
                          key={img.file_path}
                          onClick={() => setSelectedImg(img.file_path)}
                          className="rounded-lg cursor-pointer overflow-hidden w-fit relative"
                        >
                          {!isImgLoaded && <BgPlaceholder />}
                          <Image
                            width={200}
                            height={300}
                            src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${img.file_path}`}
                            alt={`profile picture from ${name}`}
                            className={`object-cover rounded-lg transition-all hover:scale-110 duration-300
                              ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                              transition-[transform,opacity] transform-gpu ease-out`}
                            priority={index < 3}
                            loading={index < 3 ? "eager" : "lazy"}
                            onLoad={() => {
                              dispatch(setImageLoaded(img.file_path));
                            }}
                          />
                        </motion.div>
                      );
                    })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next Button */}
            <button
              onClick={() => moveSlide("right")}
              className="absolute right-0 sm:-right-6 xl:-right-12 2xl:-right-16 top-1/2 -translate-y-1/2
                z-10 p-2 bg-black/60 text-white rounded-full hover:bg-gray-800 transition
                shadow-blueGlow"
            >
              <FaChevronRight className="text-2xl sm:text-3xl" />
            </button>
          </div>
        </div>
      )}

      {/* Image Viewer Modal */}
      <AnimatePresence>
        {selectedImg && (
          <ImgViewer
            imgViewerSrc={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_ORI}${selectedImg}`}
            alt={`profile picture from ${name}`}
            onClose={() => setSelectedImg(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default memo(PersonImgsSlider);

interface ImgViewerProps {
  imgViewerSrc: string;
  alt: string;
  onClose: () => void;
}

const ImgViewer = memo(({ imgViewerSrc, onClose, alt }: ImgViewerProps) => {
  const [isImgLoaded, setIsImgLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        transition={{ duration: 0.1 }}
        className="relative max-w-[450px] max-h-[660px] w-[450px] aspect-[2/3] flex items-center
          justify-center"
      >
        {!isImgLoaded && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <SiSpinrilla className="animate-spin text-5xl text-blue-400" />
          </div>
        )}
        <Image
          src={imgViewerSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`rounded-lg shadow-lg w-auto h-auto
            ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
            transition-[transform,opacity] duration-300 transform-gpu ease-out`}
          onLoad={() => setIsImgLoaded(true)}
          onClick={(e) => e.stopPropagation()}
        />
        {isImgLoaded && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/70 text-white rounded-full p-2 hover:bg-black"
          >
            ✕
          </button>
        )}
      </motion.div>
    </motion.div>
  );
});

ImgViewer.displayName = "ImgViewer";
