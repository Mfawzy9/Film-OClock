import { JSX } from "react";
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
import { handleShare } from "../../../../../helpers/helpers";
import { FaNotesMedical } from "@react-icons/all-files/fa/FaNotesMedical";
import { FiShare2 } from "@react-icons/all-files/fi/FiShare2";
import { MdAssignmentTurnedIn } from "@react-icons/all-files/md/MdAssignmentTurnedIn";
import { RiHeartAddFill } from "@react-icons/all-files/ri/RiHeartAddFill";
import { RiHeartsFill } from "@react-icons/all-files/ri/RiHeartsFill";
import { RiLoader2Fill } from "@react-icons/all-files/ri/RiLoader2Fill";

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
  if (!theShow) return null;
  const showType = "original_title" in theShow ? "movie" : "tv";

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
          <RiLoader2Fill className="animate-spin text-4xl" />
        ) : !isInLibrary ? (
          <>
            {addIcon}
            <span
              className="absolute opacity-0 lg:group-hover:opacity-100 top-0 group-hover:-top-8 left-1/2
                transition-all duration-300 transform -translate-x-1/2 bg-gray-800 text-white
                text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none capitalize
                hidden xs:block"
            >
              {t("AddTo")} {libraryName}
            </span>
          </>
        ) : (
          <>
            {removeIcon}
            <span
              className="absolute opacity-0 lg:group-hover:opacity-100 top-0 group-hover:-top-8 left-1/2
                transition-all duration-300 transform -translate-x-1/2 bg-gray-800 text-white
                text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none capitalize
                hidden xs:block"
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
        <FaNotesMedical className="text-3xl" />,
        <MdAssignmentTurnedIn className="text-3xl text-green-600" />,
      )}

      {/* Favorites */}
      {renderButton(
        "favorites",
        libraryState.favorites,
        <RiHeartAddFill className="text-3xl" />,
        <RiHeartsFill className="text-3xl text-green-600" />,
      )}

      <button
        onClick={() =>
          handleShare({
            showId,
            showType,
            theShow: theShow as Movie | TVShow,
            t,
          })
        }
        className="relative group cursor-pointer hover:text-blue-500 disabled:cursor-not-allowed
          disabled:opacity-70 disabled:hover:text-white"
      >
        <FiShare2 className="text-3xl" />
        <span
          className="absolute opacity-0 lg:group-hover:opacity-100 top-0 group-hover:-top-8 left-1/2
            transition-all duration-300 transform -translate-x-1/2 bg-gray-800 text-white
            text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none capitalize
            hidden xs:block"
        >
          {t("Share")}
        </span>
      </button>
    </div>
  );
};

export default WatchlistFavoriteBtns;
