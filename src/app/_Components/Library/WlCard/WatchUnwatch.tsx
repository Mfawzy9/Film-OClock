"use client";
import useLibrary from "@/app/hooks/useLibrary";
import { useTranslations } from "next-intl";
import { CgSpinnerTwo } from "react-icons/cg";
import { FaEye, FaEyeSlash } from "react-icons/fa6";

const WatchUnwatch = ({
  isWatched,
  showId,
  isFetching,
}: {
  isWatched: boolean;
  showId: number;
  isFetching: boolean;
}) => {
  const t = useTranslations("Library");
  const { handleWatchedUnwatched, isWatchedLoading } = useLibrary({
    dropDownMenu: false,
  });

  return (
    <div className="mt-auto grow flex items-end">
      <button
        disabled={isWatchedLoading || isFetching}
        className="text-blue-500 flex items-center justify-start gap-2 min-w-28 hover:text-white
          hover:brightness-125 hover:underline disabled:opacity-70
          disabled:cursor-not-allowed"
        onClick={() =>
          handleWatchedUnwatched({
            isWatched: !isWatched,
            showId,
          })
        }
      >
        {isWatchedLoading || isFetching ? (
          <CgSpinnerTwo className="mx-auto animate-spin text-2xl" />
        ) : isWatched ? (
          <>
            <span className="flex items-center gap-1 font-bold">
              <FaEye /> {t("Watchlist.Watched")}
            </span>
          </>
        ) : (
          <>
            <FaEyeSlash className="text-lg" />
            {t("Watchlist.UnWatched")}
          </>
        )}
      </button>
    </div>
  );
};

export default WatchUnwatch;
