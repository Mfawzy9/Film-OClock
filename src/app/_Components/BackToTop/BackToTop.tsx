import { AnimatePresence, motion, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { FaArrowAltCircleUp } from "react-icons/fa";
import { scrollToTop } from "../../../../helpers/helpers";

const BackToTop = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 100);
    });
    return () => unsubscribe();
  }, [scrollY]);
  return (
    <>
      <AnimatePresence initial={false}>
        {isScrolled && (
          <motion.button
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="w-[45px] h-[45px] bg-[linear-gradient(#1e3a8a,#2563eb)]
              hover:bg-[linear-gradient(#2563eb,#1e3a8a)] flex items-center justify-center
              rounded-full cursor-pointer border-none group fixed bottom-5 sm:bottom-7 right-3
              sm:right-5 z-40"
            onClick={scrollToTop}
          >
            <FaArrowAltCircleUp className="w-6 h-6 text-gray-200" />

            <span
              className="text absolute bottom-[-20px] rounded w-fit whitespace-nowrap py-0.5 px-1
                text-white bg-gray-950/70 text-[0.7em] opacity-0 flex items-center
                justify-center transition-opacity duration-500 group-hover:opacity-100
                group-hover:animate-slide-in-bottom pointer-events-none"
            >
              Back to top
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default BackToTop;
