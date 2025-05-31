import { JSX, useEffect, useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import useLibrary, { FirestoreTheShowI } from "@/app/hooks/useLibrary";
import { WatchHistoryItem } from "@/app/interfaces/localInterfaces/watchHistoryInterfaces";
import { useTranslations } from "next-intl";
import { handleShare, nameToSlug } from "../../../../../helpers/helpers";
import { FaNotesMedical } from "@react-icons/all-files/fa/FaNotesMedical";
import { FaPlay } from "@react-icons/all-files/fa/FaPlay";
import { FiShare2 } from "@react-icons/all-files/fi/FiShare2";
import { BsThreeDots } from "@react-icons/all-files/bs/BsThreeDots";
import { MdAssignmentTurnedIn } from "@react-icons/all-files/md/MdAssignmentTurnedIn";
import { RiHeartAddFill } from "@react-icons/all-files/ri/RiHeartAddFill";
import { RiHeartsFill } from "@react-icons/all-files/ri/RiHeartsFill";
import { RiLoader2Fill } from "@react-icons/all-files/ri/RiLoader2Fill";

const WatchlistFavoriteDD = ({
  showId,
  showType,
  theShow,
  episode,
  season,
}: {
  showId: number;
  showType: "movie" | "tv";
  theShow: Movie | TVShow | FirestoreTheShowI | WatchHistoryItem;
  episode?: number;
  season?: number;
}) => {
  const t = useTranslations("CardDropDownMenu");
  const [dropDownMenu, setDropDownMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { libraryState, loadingState, handleLibraryClick } = useLibrary({
    showId,
    theShow: theShow as Movie | TVShow,
    dropDownMenu: dropDownMenu,
  });

  // Close dropdown on click outside
  useEffect(() => {
    if (!dropDownMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setDropDownMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropDownMenu]);

  const handleItemClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDropDownMenu(false);
  };

  const renderLibraryItem = (
    library: "watchlist" | "favorites",
    isInLibrary: boolean,
    addIcon: JSX.Element,
    removeIcon: JSX.Element,
    addText: string,
    removeText: string,
  ) => {
    const isLoading =
      loadingState[library] ||
      (loadingState.initialLoading && !libraryState[library]);

    return (
      <li
        onClick={(e) => {
          e.stopPropagation();
          handleLibraryClick(library).then(() => setDropDownMenu(false));
        }}
        className={`flex relative items-center gap-2 px-2 py-0.5 transition-all duration-200
          whitespace-nowrap
          ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-blue-700 lg:hover:shadow-blueGlow"}`}
      >
        {isLoading ? (
          <RiLoader2Fill className="animate-spin text-xl" />
        ) : !isInLibrary ? (
          <>
            {addIcon}
            {addText}
          </>
        ) : (
          <>
            {removeIcon}
            {removeText}
          </>
        )}
      </li>
    );
  };

  const slug = nameToSlug(
    (theShow as Movie | FirestoreTheShowI | WatchHistoryItem).title ||
      (theShow as Movie).original_title ||
      (theShow as TVShow).name ||
      (theShow as TVShow).original_name ||
      "",
  );

  const watchHref =
    showType === "movie"
      ? `/watch/movie/${showId}/${slug}`
      : `/watch/tv/${showId}/${slug}?season=${season || 1}&episode=${episode || 1}`;

  const handleShareClick = async () => {
    await handleShare({
      showId,
      showType,
      theShow: theShow as Movie | TVShow,
      t,
    }).then(() => setDropDownMenu(false));
  };

  return (
    <>
      <div
        className="absolute top-1 sm:top-2 end-2 z-30 cursor-pointer p-0.5 text-black
          hover:text-white bg-gray-300 border border-gray-400 hover:border-blue-600
          hover:bg-blue-700 rounded-full"
        ref={dropdownRef}
      >
        <BsThreeDots
          className="text-2xl sm:text-lg 4xl:text-xl"
          onClick={() => setDropDownMenu(!dropDownMenu)}
        />
      </div>
      {dropDownMenu && (
        <div
          className="absolute inset-0 backdrop-blur-sm z-20 cursor-default"
          onClick={() => setDropDownMenu(false)}
        >
          <ul
            onClick={(e) => e.stopPropagation()}
            ref={listRef}
            className="absolute top-3 end-7 md:top-9 md:end-2 bg-black/90 rounded shadow-blueGlow px-2
              py-2 space-y-2 text-xs min-w-[150px]"
          >
            {renderLibraryItem(
              "watchlist",
              libraryState.watchlist,
              <FaNotesMedical className="text-xl" />,
              <MdAssignmentTurnedIn className="text-xl text-green-600" />,
              t("AddToWatchlist"),
              t("RemoveFromWatchlist"),
            )}
            {renderLibraryItem(
              "favorites",
              libraryState.favorites,
              <RiHeartAddFill className="text-xl" />,
              <RiHeartsFill className="text-xl text-green-600" />,
              t("AddToFavorites"),
              t("RemoveFromFavorites"),
            )}
            {new Date(
              (theShow as FirestoreTheShowI | WatchHistoryItem).releaseDate ||
                (theShow as TVShow).first_air_date ||
                (theShow as Movie).release_date,
            ) <= new Date() && (
              <li onClick={handleItemClick}>
                <Link
                  href={watchHref}
                  className="flex relative items-center gap-2 px-2 py-0.5 transition-all duration-200
                    hover:bg-blue-700 lg:hover:shadow-blueGlow cursor-pointer"
                >
                  <FaPlay className="text-lg" />
                  {t("Watch")}
                </Link>
              </li>
            )}
            <li onClick={handleItemClick}>
              <button
                onClick={handleShareClick}
                className="flex relative items-center gap-2 px-2 py-0.5 transition-all duration-200
                  hover:bg-blue-700 lg:hover:shadow-blueGlow cursor-pointer w-full"
              >
                <FiShare2 className="text-xl" />
                {t("Share")}
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default WatchlistFavoriteDD;
