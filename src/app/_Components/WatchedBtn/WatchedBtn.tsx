import useWatchedList from "@/app/hooks/useWatchedList";
import {
  MovieDetailsResponse,
  TvDetailsResponse,
} from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import { useTranslations } from "next-intl";
import { CgSpinnerTwo } from "react-icons/cg";
import { FaCheckCircle } from "react-icons/fa";
import { FaEye } from "react-icons/fa6";

const WatchedBtn = ({
  className,
  showId,
  showName,
  theShow,
}: {
  className?: string;
  showId: number;
  showName: string;
  theShow: MovieDetailsResponse | TvDetailsResponse;
}) => {
  const t = useTranslations("Library.WatchedList");
  const { handleClick, isInWatchedShows, isLoading } = useWatchedList({
    showId,
  });

  return (
    <button
      disabled={isLoading}
      className={`bg-gray-900 hover:bg-gray-800 text-blue-400 hover:text-white transition-colors
        duration-200 -mt-4 rounded-b-md flex items-center justify-center text-sm py-2
        gap-1 ${className ?? ""} disabled:opacity-70 disabled:cursor-not-allowed`}
      onClick={() => handleClick({ showName, showId, theShow })}
    >
      {isLoading ? (
        <CgSpinnerTwo className="mx-auto animate-spin text-2xl" />
      ) : isInWatchedShows ? (
        <>
          <FaCheckCircle />
          <span className="font-semibold">{t("Watched")}</span>
        </>
      ) : (
        <>
          <FaEye /> {t("NotWatched")}
        </>
      )}
    </button>
  );
};

export default WatchedBtn;
