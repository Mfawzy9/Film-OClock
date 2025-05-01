import { JSX } from "react";
import { FaHeartCircleCheck, FaHeartCirclePlus } from "react-icons/fa6";
import { MdAssignmentAdd, MdAssignmentTurnedIn } from "react-icons/md";
import { PiSpinnerGapBold } from "react-icons/pi";
import {
  MovieDetailsResponse,
  TvDetailsResponse,
} from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import useLibrary from "@/app/hooks/useLibrary";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { useTranslations } from "next-intl";

const WatchlistFavoriteBtns = ({
  showId,
  theShow,
}: {
  showId: number;
  theShow: Movie | MovieDetailsResponse | TVShow | TvDetailsResponse;
}) => {
  const t = useTranslations("Library");
  const { libraryState, loadingState, handleLibraryClick } = useLibrary({
    showId,
    theShow,
    dropDownMenu: true,
  });

  const renderButton = (
    library: "watchlist" | "favorites",
    isInLibrary: boolean,
    addIcon: JSX.Element,
    removeIcon: JSX.Element,
  ) => {
    const isLoading =
      loadingState[library] ||
      (loadingState.initialLoading && !libraryState[library]);

    const libraryName =
      library === "watchlist"
        ? t("Watchlist.WatchlistName")
        : t("Favourites.FavoritesName");

    return (
      <button
        disabled={isLoading}
        onClick={() => handleLibraryClick(library)}
        className="relative group cursor-pointer hover:text-blue-500 disabled:cursor-not-allowed
          disabled:opacity-70 disabled:hover:text-white"
      >
        {isLoading ? (
          <PiSpinnerGapBold className="animate-spin text-4xl" />
        ) : !isInLibrary ? (
          <>
            {addIcon}
            <span
              className="absolute block opacity-0 group-hover:opacity-100 top-0 group-hover:-top-8
                left-1/2 transition-all duration-300 transform -translate-x-1/2 bg-gray-800
                text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none
                capitalize"
            >
              {t("AddTo")} {libraryName}
            </span>
          </>
        ) : (
          <>
            {removeIcon}
            <span
              className="absolute block opacity-0 group-hover:opacity-100 top-0 group-hover:-top-8
                left-1/2 transition-all duration-300 transform -translate-x-1/2 bg-gray-800
                text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none
                capitalize"
            >
              {t("RemoveFrom")} {libraryName}
            </span>
          </>
        )}
      </button>
    );
  };

  return (
    <div className="flex items-center justify-center xs:justify-start gap-4">
      {/* Watchlist */}
      {renderButton(
        "watchlist",
        libraryState.watchlist,
        <MdAssignmentAdd className="text-3xl" />,
        <MdAssignmentTurnedIn className="text-3xl text-green-600" />,
      )}

      {/* Favorites */}
      {renderButton(
        "favorites",
        libraryState.favorites,
        <FaHeartCirclePlus className="text-3xl" />,
        <FaHeartCircleCheck className="text-3xl text-green-600" />,
      )}
    </div>
  );
};

export default WatchlistFavoriteBtns;
