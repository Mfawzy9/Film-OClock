import { closeModal } from "@/lib/Redux/localSlices/videoModalSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { motion } from "framer-motion";
import { IoIosClose } from "@react-icons/all-files/io/IoIosClose";
import { SiSpinrilla } from "@react-icons/all-files/si/SiSpinrilla";

const VideoModal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isOpen, videoSrc } = useSelector(
    (state: RootState) => state.videoModalReducer,
  );

  const handleCloseModal = () => {
    dispatch(closeModal());
  };
  if (!isOpen || !videoSrc) return null;
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col gap-5 items-center justify-center bg-black/90"
          onClick={handleCloseModal}
        >
          <button
            onClick={() => dispatch(closeModal())}
            className="text-5xl z-50"
          >
            <IoIosClose className="rounded-full shadow-blueGlow hover:[box-shadow:0_0_30px_#1c64f2]" />
          </button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="aspect-video w-full max-w-full md:max-w-screen-md xl:max-w-screen-lg
              4xl:max-w-screen-xl shadow-blueGlow flex justify-center items-center relative
              bg-gray-950"
            onClick={(e) => e.stopPropagation()}
          >
            <SiSpinrilla className="absolute text-6xl text-white animate-spin" />
            <iframe
              src={`${videoSrc.includes("?") ? `${videoSrc}&autoplay=1` : `${videoSrc}?autoplay=1`}`}
              title="Movie Trailer"
              allowFullScreen
              className="w-full h-full z-10"
              loading="lazy"
              allow="autoplay; encrypted-media"
            />
          </motion.div>
        </div>
      )}
    </>
  );
};

export default VideoModal;
