import { VideosQueryParams } from "@/app/interfaces/apiInterfaces/videosInterfaces";
import { Link } from "@/i18n/navigation";
import TrailerBtn from "../TrailerBtn/TrailerBtn";
import { memo } from "react";
import WatchBtn from "../../WatchBtn/WatchBtn";
import { TbListDetails } from "react-icons/tb";
import { useTranslations } from "next-intl";
import { nameToSlug } from "../../../../../helpers/helpers";

const HomeSliderBtns = ({
  showType,
  showId,
  name,
  className,
  releaseDate,
}: VideosQueryParams & { name: string } & { className?: string } & {
  releaseDate: string;
}) => {
  const t = useTranslations("HomePage");
  const detailsLink = `/details/${showType}/${showId}/${nameToSlug(name)}`;
  return (
    <div
      className={`flex flex-wrap justify-center items-center gap-5 mt-2 ${className ?? ""}`}
    >
      <div className="relative inline-flex items-center justify-center gap-4 group">
        <div
          className="absolute inset-0 duration-1000 opacity-60 transitiona-all bg-gradient-to-r
            from-blue-600 via-blue-600 to-blue-400 rounded-xl blur-lg filter
            lg:group-hover:opacity-100 group-hover:duration-200"
        />
        <Link
          className="group relative inline-flex items-center justify-center rounded-xl bg-gray-950
            px-6 py-3 font-semibold text-white transition-all duration-200 hover:bg-gray-950
            lg:hover:shadow-lg lg:hover:-translate-y-0.5"
          href={detailsLink}
        >
          <TbListDetails className="me-1" />
          {t("HomeSlider.DetailsBtn")}
        </Link>
      </div>

      {new Date(releaseDate) <= new Date() && (
        <WatchBtn showType={showType} showId={showId} name={name} />
      )}

      <TrailerBtn showType={showType} showId={showId} />
    </div>
  );
};

export default memo(HomeSliderBtns);
