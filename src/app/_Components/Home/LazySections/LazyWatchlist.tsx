import useLibrary from "@/app/hooks/useLibrary";
import LoggedinEmptyWL from "../../Library/LoggedinEmptyWL/LoggedinEmptyWL";
import LoggedoutEmptyWL from "../../Library/LoggedoutEmptyWL/LoggedoutEmptyWL";
import { useTranslations } from "next-intl";
import { memo, useMemo } from "react";
import WlFClearBtn from "../../Library/TitleClearBtn/WlFClearBtn";
import dynamic from "next/dynamic";

const CardsSkeletonSlider = dynamic(
  () => import("../../CardsSlider/CardsSkeletonSlider"),
);
const CardsSlider = dynamic(() => import("../../CardsSlider/CardsSlider"));
const LazyRender = dynamic(() => import("../../LazyRender/LazyRender"));

const LazyWatchlist = () => {
  const t = useTranslations("HomePage");

  const { watchlist, user, isClearLoading, handleClearLibrary } = useLibrary({
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
  return (
    <>
      <main
        className={`bg-gray-900 border border-gray-700 rounded-lg min-h-[400px] ${ (!user ||
          !watchlist || watchlist.length === 0) && "flex items-center justify-center" }`}
      >
        {user && watchlist && watchlist.length === 0 ? (
          <LoggedinEmptyWL />
        ) : (
          !user && <LoggedoutEmptyWL />
        )}
        {user && watchlist && watchlist.length > 0 && (
          <div className="p-2 sm:p-4 relative">
            <LazyRender
              Component={CardsSlider}
              loading={
                <CardsSkeletonSlider arrLength={sliderProps.arrLength} />
              }
              props={sliderProps}
            />
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
