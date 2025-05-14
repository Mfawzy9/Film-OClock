import { useRouter as useNextIntlRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { FaPlay } from "react-icons/fa6";
import { nameToSlug } from "../../../../helpers/helpers";
import { useRouter } from "@bprogress/next/app";

interface WatchBtnProps {
  showType: "movie" | "tv";
  showId: number;
  season?: number;
  episode?: number;
  moveToTabs?: () => void;
  name: string;
}

const WatchBtn = ({
  showType,
  showId,
  season = 1,
  episode = 1,
  name,
  moveToTabs,
}: WatchBtnProps) => {
  const { push } = useRouter({ customRouter: useNextIntlRouter });
  const t = useTranslations("HomePage");

  const handleClick = () => {
    if (moveToTabs) {
      moveToTabs();
    } else {
      push(
        showType === "movie"
          ? `/watch/movie/${showId}/${nameToSlug(name)}`
          : `/watch/tv/${showId}/${nameToSlug(name)}?season=${season}&episode=${episode}`,
      );
    }
  };

  return (
    <>
      <div className="relative group">
        <button
          onClick={handleClick}
          className="relative inline-block p-px font-semibold leading-6 text-white bg-gray-700
            shadow-2xl cursor-pointer rounded-2xl shadow-blue-900 transition-all
            duration-300 ease-in-out hover:scale-105 active:scale-95 hover:shadow-blue-600"
        >
          <span
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500
              to-sky-600 p-[2px] opacity-0 transition-opacity duration-500
              group-hover:opacity-100"
          />
          <span className="relative z-10 block px-4 py-3 rounded-2xl bg-neutral-950">
            <div className="relative z-10 flex items-center gap-3">
              <span
                className="transition-all duration-500 group-hover:translate-x-1.5
                  group-hover:text-blue-300"
              >
                {t("HomeSlider.WatchNowBtn")}
              </span>
              <FaPlay className="group-hover:text-blue-300" />
            </div>
          </span>
        </button>
      </div>
    </>
  );
};

export default WatchBtn;
