import {
  closeImgModal,
  nextImage,
  prevImage,
} from "@/lib/Redux/localSlices/imgModalSlice";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/Redux/store";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import { useMemo, useState, useCallback } from "react";
import { SiSpinrilla } from "react-icons/si";
import throttle from "lodash/throttle";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import useIsArabic from "@/app/hooks/useIsArabic";

const throttledNavigation = throttle(
  (action: () => ReturnType<AppDispatch>, dispatch: AppDispatch) => {
    dispatch(action());
  },
  300,
  { leading: true, trailing: false },
);

const ImageModal = () => {
  const { isArabic } = useIsArabic();
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, images, selectedIndex } = useSelector(
    (state: RootState) => state.imgModalReducer,
    shallowEqual,
  );

  // Memoize the selected image to prevent extra re-renders
  const selectedImage = useMemo(() => {
    if (selectedIndex !== null) {
      return images[selectedIndex] || "";
    }
    return "";
  }, [images, selectedIndex]);

  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: "50%", y: "50%" });

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      const { left, top, width, height } =
        e.currentTarget.getBoundingClientRect();
      const x = ((e.clientX - left) / width) * 100;
      const y = ((e.clientY - top) / height) * 100;

      setZoomPosition({ x: `${x}%`, y: `${y}%` });

      // Functional update to ensure the latest state is used
      setIsZoomed((prev) => !prev);
    },
    [],
  );

  const isImgLoaded = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs[selectedImage],
    shallowEqual,
  );

  if (!isOpen || selectedIndex === null) return null;
  return (
    <div
      className="fixed inset-0 bg-black/95 flex items-center justify-center z-50"
      onClick={() => dispatch(closeImgModal())}
    >
      {/* Close Button */}
      <button
        onClick={() => dispatch(closeImgModal())}
        className="absolute top-5 right-5 text-white text-3xl hover:text-gray-400"
      >
        <FaTimes />
      </button>

      {/* Image Container */}
      <motion.div
        onClick={(e) => e.stopPropagation()}
        key={selectedImage}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={(e, { offset, velocity }) => {
          if (isZoomed) return;

          const swipe = Math.abs(offset.x) * velocity.x;
          if (swipe < -1000) {
            throttledNavigation(nextImage, dispatch);
          } else if (swipe > 1000) {
            throttledNavigation(prevImage, dispatch);
          }
        }}
        className="relative w-full lg:w-3/4 flex justify-center items-center"
      >
        {/* Background Effect */}
        <SiSpinrilla className="absolute animate-spin text-6xl text-white -z-10" />
        {/* Image */}
        <Image
          onDoubleClick={handleDoubleClick}
          src={selectedImage}
          alt="Selected Image"
          width={800}
          height={600}
          priority={selectedIndex === 0}
          className={`object-contain w-full rounded-lg transition-all duration-300
            ${isImgLoaded ? " opacity-100" : " opacity-0"}
            ${isZoomed ? "scale-[2.5] cursor-zoom-out" : "scale-100 cursor-zoom-in"}`}
          style={{
            transformOrigin: `${zoomPosition.x} ${zoomPosition.y}`,
          }}
          onLoad={() => {
            dispatch(setImageLoaded(selectedImage ?? ""));
          }}
        />
      </motion.div>

      {/* Navigation Buttons */}
      {/* Previous Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          throttledNavigation(prevImage, dispatch);
        }}
        className="bg-black/50 p-3 text-white rounded-full hover:bg-gray-700 shadow-blueGlow
          absolute start-[5%] bottom-1/4 xs:bottom-[18%] sm:bottom-[10%] md:bottom-2
          lg:bottom-[unset]"
      >
        {isArabic ? (
          <FaChevronRight className="text-3xl 4xl:text-7xl" />
        ) : (
          <FaChevronLeft className="text-3xl 4xl:text-7xl" />
        )}
      </button>

      {/* Next Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          throttledNavigation(nextImage, dispatch);
        }}
        className="bg-black/50 p-3 text-white rounded-full hover:bg-gray-700 shadow-blueGlow
          absolute end-[5%] bottom-1/4 xs:bottom-[18%] sm:bottom-[10%] md:bottom-2
          lg:bottom-[unset]"
      >
        {isArabic ? (
          <FaChevronLeft className="text-3xl 4xl:text-7xl" />
        ) : (
          <FaChevronRight className="text-3xl 4xl:text-7xl" />
        )}
      </button>
    </div>
  );
};

export default ImageModal;
