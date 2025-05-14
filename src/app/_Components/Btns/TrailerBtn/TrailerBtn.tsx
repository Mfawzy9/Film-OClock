import { useGetTrailer } from "@/app/hooks/useGetTrailer";
import { VideosQueryParams } from "@/app/interfaces/apiInterfaces/videosInterfaces";
import { useTranslations } from "next-intl";
import { useCallback } from "react";
import { MdOutlineOndemandVideo } from "react-icons/md";

const TrailerBtn = ({ showType, showId }: VideosQueryParams) => {
  const t = useTranslations("HomePage");
  const { showTrailer } = useGetTrailer();

  const handleClick = useCallback(() => {
    showTrailer(showId, showType);
  }, [showId, showType, showTrailer]);
  return (
    <button
      onClick={handleClick}
      className="group relative cursor-pointer outline-none border-none rounded-full flex
        [box-shadow:0_0_20px_#991b1b] flex-row items-center justify-center h-14 w-14
        lg:hover:!w-[100px] text-nowrap transition-all duration-[0.75s]
        before:content-[''] before:absolute before:w-full before:h-full before:inset-0
        before:bg-[linear-gradient(130deg,#991b1b,#991b1b_33%,#991b1b)]
        before:rounded-full before:transition before:duration-300 text-white"
    >
      <MdOutlineOndemandVideo
        className="absolute left-3 lg:group-hover:left-1.5 lg:group-active:left-[10px] duration-300
          transition-[left] z-10 w-8 h-8 text-white"
      />

      <span
        className="absolute right-1.5 text-[17px] font-semibold [--w:calc(100%-48px)] w-[--w]
          max-w-[--w] overflow-hidden flex items-center justify-end -z-[1]
          lg:group-hover:z-[9] pointer-events-none select-none opacity-0
          lg:group-hover:opacity-100 text-transparent group-hover:text-inherit
          lg:group-active:right-2 transition-all duration-[2s] lg:group-hover:duration-300
          lg:group-active:scale-[0.85]"
      >
        {t("HomeSlider.WatchTrailerBtn")}
      </span>
    </button>
  );
};

export default TrailerBtn;
