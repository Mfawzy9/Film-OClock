import { useTranslations } from "next-intl";
import { CgSpinner } from "react-icons/cg";
import { FaTrash } from "react-icons/fa6";

interface ClearBtnProps {
  handleClearLibrary: (data: {
    libraryType: "watchlist" | "favorites";
  }) => Promise<void>;
  libraryType: "watchlist" | "favorites";
  isClearLoading: boolean;
  fixed?: boolean;
}
const WlFClearBtn = ({
  handleClearLibrary,
  libraryType,
  isClearLoading,
  fixed = true,
}: ClearBtnProps) => {
  const t = useTranslations("Library");
  return (
    <button
      disabled={isClearLoading}
      onClick={() => handleClearLibrary({ libraryType })}
      className={` bg-red-950 text-red-400 border border-red-400 border-b-4 font-medium
        overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150
        hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 flex
        items-center gap-1 group disabled:opacity-50 disabled:cursor-not-allowed
        disabled:pointer-events-none
        ${libraryType === "watchlist" && fixed ? "lg:fixed lg:end-[5%] xl:end-16" : ""} `}
    >
      <span
        className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px]
          rounded-md opacity-50 group-hover:top-[150%] duration-500
          shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"
      />
      {isClearLoading ? (
        <>
          <CgSpinner className="animate-spin" /> {t("Watchlist.Clearing")}
        </>
      ) : (
        <>
          <FaTrash />
          {libraryType === "watchlist"
            ? t("Watchlist.ClearBtn")
            : t("Favourites.ClearBtn")}
        </>
      )}
    </button>
  );
};

export default WlFClearBtn;
