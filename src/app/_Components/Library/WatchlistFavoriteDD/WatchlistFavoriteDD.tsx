import { JSX, useEffect, useRef, useState } from "react";
import { FaHeartCirclePlus, FaHeartCircleCheck, FaPlay } from "react-icons/fa6";
import { MdAssignmentAdd, MdAssignmentTurnedIn } from "react-icons/md";
import { HiDotsCircleHorizontal } from "react-icons/hi";
import { Link } from "@/i18n/navigation";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { PiSpinnerGapBold } from "react-icons/pi";
import useLibrary, { FirestoreTheShowI } from "@/app/hooks/useLibrary";
import { FiShare2 } from "react-icons/fi";
import { toast } from "sonner";
import { WatchHistoryItem } from "@/app/interfaces/localInterfaces/watchHistoryInterfaces";
import { useTranslations } from "next-intl";
import { nameToSlug } from "../../../../../helpers/helpers";

export function getDetailsShareUrl(
  show: FirestoreTheShowI | WatchHistoryItem | Movie | TVShow,
  showType: string,
  showId: number,
) {
  const locale =
    typeof window !== "undefined"
      ? window.location.pathname.split("/")[1]
      : "en";
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const title =
    (show as Movie).original_title ||
    (show as TVShow).original_name ||
    (show as FirestoreTheShowI).title ||
    (show as WatchHistoryItem).title ||
    "";

  const slug = nameToSlug(title);
  return `${origin}/${locale}/details/${showType}/${showId}/${slug}`;
}

const WatchlistFavoriteDD = ({
  showId,
  showType,
  theShow,
  episode,
  season,
}: {
  showId: number;
  showType: string;
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
          ${isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:bg-blue-700 hover:shadow-blueGlow"}`}
      >
        {isLoading ? (
          <PiSpinnerGapBold className="animate-spin text-xl" />
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
    (theShow as Movie).original_title ||
      (theShow as TVShow).original_name ||
      (theShow as FirestoreTheShowI).title ||
      (theShow as WatchHistoryItem).title ||
      "",
  );

  const watchHref =
    showType === "movie"
      ? `/watch/movie/${showId}/${slug}`
      : `/watch/tv/${showId}/${slug}?season=${season || 1}&episode=${episode || 1}`;

  const handleShare = async () => {
    const shareUrl = getDetailsShareUrl(theShow, showType, showId);
    const title =
      (theShow as Movie).original_title ||
      (theShow as TVShow).original_name ||
      (theShow as FirestoreTheShowI).title ||
      (theShow as WatchHistoryItem).title;

    const text = title ? t("ShareTitle", { title }) : t("Share2Title");

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (error) {
      if (error === "AbortError") {
        toast.error("Failed to share link");
      }
    } finally {
      setDropDownMenu(false);
    }
  };

  return (
    <>
      <div
        className="absolute top-1 sm:top-2 end-2 z-30 cursor-pointer"
        ref={dropdownRef}
      >
        <HiDotsCircleHorizontal
          className="text-3xl sm:text-2xl text-gray-300 bg-black hover:text-blue-500 rounded-full"
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
            className="absolute top-3 end-6 md:top-9 md:end-2 bg-black/90 rounded shadow-blueGlow px-2
              py-2 space-y-2 text-xs min-w-[150px]"
          >
            {renderLibraryItem(
              "watchlist",
              libraryState.watchlist,
              <MdAssignmentAdd className="text-xl" />,
              <MdAssignmentTurnedIn className="text-xl text-green-600" />,
              t("AddToWatchlist"),
              t("RemoveFromWatchlist"),
            )}
            {renderLibraryItem(
              "favorites",
              libraryState.favorites,
              <FaHeartCirclePlus className="text-xl" />,
              <FaHeartCircleCheck className="text-xl text-green-600" />,
              t("AddToFavorites"),
              t("RemoveFromFavorites"),
            )}
            <li onClick={handleItemClick}>
              <Link
                href={watchHref}
                className="flex relative items-center gap-2 px-2 py-0.5 transition-all duration-200
                  hover:bg-blue-700 hover:shadow-blueGlow cursor-pointer"
              >
                <FaPlay className="text-xl" />
                {t("Watch")}
              </Link>
            </li>
            <li onClick={handleItemClick}>
              <button
                onClick={handleShare}
                className="flex relative items-center gap-2 px-2 py-0.5 transition-all duration-200
                  hover:bg-blue-700 hover:shadow-blueGlow cursor-pointer w-full"
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
