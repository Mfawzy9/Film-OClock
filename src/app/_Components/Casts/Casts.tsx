import {
  MovieCast,
  TvCast,
} from "@/app/interfaces/apiInterfaces/creditsInterfaces";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import Title from "../Title/Title";
import { CgSpinner } from "react-icons/cg";
import useIsArabic from "@/app/hooks/useIsArabic";
import { nameToSlug } from "../../../../helpers/helpers";

interface CastCardProps {
  cast: MovieCast | TvCast;
  isLoaded: boolean;
  idx: number;
  dispatch: AppDispatch;
}

const CastCard = memo(({ cast, isLoaded, idx, dispatch }: CastCardProps) => {
  return (
    <Link
      className="w-36 flex-shrink-0 hover:scale-105 transition-all duration-200 overflow-hidden"
      key={`${cast.credit_id}-${idx}`}
      href={`/details/person/${cast.id}/${nameToSlug(cast?.name ?? "")}`}
    >
      <div className="w-full relative">
        {!isLoaded && <BgPlaceholder />}
        <Image
          loading="lazy"
          src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${cast?.profile_path}`}
          width={200}
          height={300}
          alt={cast.name}
          className={`rounded-lg w-full ${isLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
            transition-[transform,opacity] duration-300 transform-gpu ease-out`}
          onLoad={() => {
            dispatch(setImageLoaded(cast.profile_path ?? ""));
          }}
        />
      </div>

      <h3 className="mt-2 font-medium text-center line-clamp-1">{cast.name}</h3>
      <h5 className="text-sm text-gray-400 text-center line-clamp-2">
        {cast.character}
      </h5>
    </Link>
  );
});

CastCard.displayName = "CastCard";

const castsToDisplay = 10;

const Casts = ({
  casts,
  label,
}: {
  casts: MovieCast[] | TvCast[];
  label: string;
}) => {
  const { isArabic } = useIsArabic();
  const [visibleCastsCount, setVisibleCastsCount] = useState(castsToDisplay);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Filter casts with profile_path and name
  const filteredCasts = useMemo(() => {
    return casts.filter((cast) => cast?.profile_path && cast?.name);
  }, [casts]);

  const allCastsHaveNoProfilePath = filteredCasts.length === 0;

  // Get the casts to display based on visibleCastsCount
  const castsToShow = useMemo(() => {
    return allCastsHaveNoProfilePath
      ? casts.slice(0, visibleCastsCount)
      : filteredCasts.slice(0, visibleCastsCount);
  }, [allCastsHaveNoProfilePath, casts, filteredCasts, visibleCastsCount]);

  const hasMoreCasts = allCastsHaveNoProfilePath
    ? casts.length > visibleCastsCount
    : filteredCasts.length > visibleCastsCount;

  const scroll = useCallback((direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -400 : 400,
        behavior: "smooth",
      });
    }
  }, []);

  const checkScrollPosition = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      // For RTL (Arabic) layout
      if (isArabic) {
        // In RTL, scrollLeft starts at 0 and goes negative
        const maxScroll = scrollWidth - clientWidth;
        setShowLeftButton(scrollLeft < -1); // Show left button if not at start
        setShowRightButton(scrollLeft > -maxScroll + 1); // Show right button if not at end
      }
      // For LTR layout
      else {
        setShowLeftButton(scrollLeft > 0);
        setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
      }
    }
  }, [isArabic]);

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScrollPosition);
      // Initial check after a small delay to ensure layout is complete
      const timer = setTimeout(checkScrollPosition, 100);

      return () => {
        if (currentRef) {
          currentRef.removeEventListener("scroll", checkScrollPosition);
        }
        clearTimeout(timer);
      };
    }
  }, [checkScrollPosition, castsToShow, isArabic]);

  const dispatch = useDispatch<AppDispatch>();

  const loadedImgs = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs,
    shallowEqual,
  );

  const loadMore = () => {
    setVisibleCastsCount((prev) => prev + castsToDisplay);
  };

  if (!casts.length) return null;

  return (
    <>
      {casts.length > 0 && (
        <main className="relative my-10">
          <Title title={label} />

          {/* Scroll Buttons */}
          <>
            {/* prev */}
            {(isArabic ? showRightButton : showLeftButton) && (
              <button
                onClick={() => scroll("left")}
                className={`absolute
                ${isArabic ? "end-0 sm:-end-6 2xl:-end-16" : "start-0 sm:-start-6 2xl:-start-16"}
                top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 text-white rounded-full
                hover:bg-gray-800 transition [box-shadow:0_0_5px_#1c64f2]`}
              >
                <FaChevronLeft className="text-2xl sm:text-3xl" />
              </button>
            )}

            {/* next */}
            {(isArabic ? showLeftButton : showRightButton) && (
              <button
                onClick={() => scroll("right")}
                className={`absolute
                ${isArabic ? "start-0 sm:-start-6 2xl:-start-16" : "end-0 sm:-end-6 2xl:-end-16"}
                top-1/2 -translate-y-1/2 z-10 p-2 bg-black/60 text-white rounded-full
                hover:bg-gray-800 transition shadow-blueGlow`}
              >
                <FaChevronRight className="text-2xl sm:text-3xl" />
              </button>
            )}
          </>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-4 scroll-smooth py-5 custom-scrollbar overflow-y-hidden"
          >
            {allCastsHaveNoProfilePath
              ? castsToShow.map((cast, idx) => {
                  if (!cast?.name) return null;

                  return (
                    <Link
                      className={
                        " w-36 flex-shrink-0 hover:scale-105 transition-all duration-200 overflow-hidden"
                      }
                      key={`${cast.credit_id}-${idx}`}
                      href={`/details/person/${cast.id}/${nameToSlug(cast?.name ?? "")}`}
                    >
                      <div
                        className={`w-full relative ${!cast.profile_path && "h-[225px]"}`}
                      >
                        {!cast.profile_path && (
                          <>
                            <h3
                              className="absolute z-30 flex flex-col justify-center items-center gap-1 top-1/2 left-1/2
                                -translate-x-1/2 -translate-y-1/2"
                            >
                              {cast.name}{" "}
                              <CgSpinner className="animate-spin text-lg" />
                            </h3>
                            <BgPlaceholder />
                          </>
                        )}
                      </div>

                      <h3 className="mt-2 font-medium text-center">
                        {cast.name}
                      </h3>
                      <h5 className="text-sm text-gray-400 text-center">
                        {cast.character}
                      </h5>
                    </Link>
                  );
                })
              : castsToShow.map((cast, idx) => {
                  if (!cast?.profile_path || !cast?.name) return null;

                  const isLoaded = loadedImgs[cast.profile_path];

                  return (
                    <CastCard
                      key={`${cast.credit_id}-${idx}`}
                      cast={cast}
                      isLoaded={isLoaded}
                      idx={idx}
                      dispatch={dispatch}
                    />
                  );
                })}

            {/* Load More Card */}
            {hasMoreCasts && (
              <div
                className="w-36 h-[225px] flex-shrink-0 flex items-center justify-center cursor-pointer
                  bg-gray-800/70 hover:bg-blue-700/70 rounded-lg transition-colors duration-200"
                onClick={loadMore}
              >
                <div className="text-center p-4">
                  <div className="text-2xl mb-2">+</div>
                  <div className="text-sm">Load More</div>
                </div>
              </div>
            )}
          </div>
        </main>
      )}
    </>
  );
};

export default Casts;
