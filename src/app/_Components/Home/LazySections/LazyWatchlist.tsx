"use client";
import useLibrary from "@/app/hooks/useLibrary";
import LoggedinEmptyWL from "../../Library/LoggedinEmptyWL/LoggedinEmptyWL";
import LoggedoutEmptyWL from "../../Library/LoggedoutEmptyWL/LoggedoutEmptyWL";
import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import WlFClearBtn from "../../Library/TitleClearBtn/WlFClearBtn";
import dynamic from "next/dynamic";
import { FaCircle } from "@react-icons/all-files/fa/FaCircle";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";

const CardsSkeletonSlider = dynamic(
  () => import("../../CardsSlider/CardsSkeletonSlider"),
);
const CardsSlider = dynamic(() => import("../../CardsSlider/CardsSlider"));
const LazyRenderForServerParent = dynamic(
  () => import("../../LazyRender/LazyRenderForServerParent"),
);

const LazyWatchlist = () => {
  const t = useTranslations("HomePage");

  const { userStatusLoading } = useSelector(
    (state: RootState) => state.authReducer,
  );
  const {
    watchlist,
    user,
    isClearLoading,
    handleClearLibrary,
    getLibraryLoading,
    getLibrary,
  } = useLibrary({
    dropDownMenu: false,
  });

  const sliderProps = useMemo(
    () => ({
      arrLength: watchlist.length,
      theShows: watchlist,
      showType: "movie",
      sliderType: "movies",
      title: t("WatchlistSection.YourWatchlistSliderTitle"),
      pageLink: "/library/watchlist",
    }),
    [watchlist, t],
  );

  const isLibrarySynced = watchlist.length === getLibrary?.length;

  if (
    userStatusLoading ||
    getLibraryLoading ||
    !watchlist ||
    !isLibrarySynced
  ) {
    return (
      <div
        className="bg-gray-900 border border-gray-700 rounded-lg min-h-[460px] flex items-center
          justify-center"
      >
        <FaCircle className="text-6xl mx-auto animate-ping text-blue-300" />
      </div>
    );
  }

  return (
    <>
      <main
        className={`bg-gray-900 border border-gray-700 rounded-lg min-h-[460px] ${ (!user ||
          !watchlist || watchlist.length === 0) && "flex items-center justify-center" }`}
      >
        {user && watchlist && watchlist.length === 0 && !userStatusLoading ? (
          <LoggedinEmptyWL />
        ) : (
          !user && !userStatusLoading && <LoggedoutEmptyWL />
        )}
        {user && watchlist && watchlist.length > 0 && !userStatusLoading && (
          <div className="p-2 sm:p-4 relative">
            <LazyRenderForServerParent
              loading={
                <CardsSkeletonSlider arrLength={sliderProps.arrLength} />
              }
            >
              <CardsSlider
                theShows={watchlist}
                showType="movie"
                sliderType="movies"
                title={t("WatchlistSection.YourWatchlistSliderTitle")}
                pageLink="/library/watchlist"
              />
            </LazyRenderForServerParent>
            <div className="relative md:absolute top-2 end-2 p-2 md:p-0 flex justify-center">
              <WlFClearBtn
                handleClearLibrary={handleClearLibrary}
                libraryType="watchlist"
                isClearLoading={isClearLoading}
                fixed={false}
              />
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default memo(LazyWatchlist);
