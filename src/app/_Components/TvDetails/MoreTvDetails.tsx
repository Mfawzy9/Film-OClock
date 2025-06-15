import { FcGlobe } from "@react-icons/all-files/fc/FcGlobe";
import Accordion from "../Accordion/Accordion";
import { TvDetailsResponse } from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import Image from "next/image";
import { FcCalendar } from "@react-icons/all-files/fc/FcCalendar";
import { useTranslations } from "next-intl";
import { FaCalendarAlt } from "@react-icons/all-files/fa/FaCalendarAlt";
import { GiPapers } from "@react-icons/all-files/gi/GiPapers";
import { RiMovie2Fill } from "@react-icons/all-files/ri/RiMovie2Fill";
import { JSX } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import { nameToSlug } from "../../../../helpers/helpers";
import { Link } from "@/i18n/navigation";

interface MoreTvDetailsProps {
  tvShow: TvDetailsResponse;
  openedAccordion: string | null;
  setOpenedAccordion: React.Dispatch<React.SetStateAction<string | null>>;
  isArabic: boolean;
}

export const releaseStatusMap = (t: any) => {
  return {
    Released: t("Status.Values.Released"),
    "Post Production": t("Status.Values.PostProduction"),
    "In Production": t("Status.Values.InProduction"),
    "In Development": t("Status.Values.InDevelopment"),
    Planned: t("Status.Values.Planned"),
    Rumored: t("Status.Values.Rumored"),
    Canceled: t("Status.Values.Canceled"),
    Ended: t("Status.Values.Ended"),
    "Returning Series": t("Status.Values.ReturningSeries"),
  } as Record<string, any>;
};

interface StatCardProps {
  icon: JSX.Element;
  title: string;
  value: string | number;
}

const StatCard = ({ icon, title, value }: StatCardProps) => (
  <div className="flex gap-3 items-center bg-gray-900 p-4 rounded-lg grow">
    <div className="text-2xl sm:text-3xl text-blue-300">{icon}</div>
    <div>
      <h4 className="text-blue-300 text-sm font-light mb-1">{title}</h4>
      <p className="text-white font-semibold text-lg">{value}</p>
    </div>
  </div>
);

const statsData = (tvShow: TvDetailsResponse, t: any): StatCardProps[] => [
  {
    icon: <GiPapers />,
    title: t("SeasonsAndEpisodes.Seasons"),
    value: tvShow?.number_of_seasons ?? "N/A",
  },
  {
    icon: <RiMovie2Fill />,
    title: t("SeasonsAndEpisodes.Episodes"),
    value: tvShow?.number_of_episodes ?? "N/A",
  },
  {
    icon: <FaCalendarAlt />,
    title: t("SeasonsAndEpisodes.FirstAirDate"),
    value: tvShow?.first_air_date ?? "N/A",
  },
  {
    icon: <FaCalendarAlt />,
    title: t("SeasonsAndEpisodes.LastAirDate"),
    value: tvShow?.last_air_date ?? "N/A",
  },
];

const MoreTvDetails = ({
  tvShow,
  openedAccordion,
  setOpenedAccordion,
  isArabic,
}: MoreTvDetailsProps) => {
  const t = useTranslations("TvDetails.Tabs.MoreInfo");
  const loadedImgs = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs,
    shallowEqual,
  );
  const dispatch = useDispatch();
  return (
    <div className="space-y-4">
      {/* Production Companies */}
      <Accordion
        id="production-companies"
        openedAccordion={openedAccordion}
        setOpenedAccordion={setOpenedAccordion}
        title={t("ProductionCompanies")}
      >
        <div className="p-4 bg-gray-950 flex flex-wrap gap-2">
          {tvShow?.production_companies?.map((company) => {
            const isImgLoaded =
              company?.logo_path && loadedImgs[company?.logo_path];
            return (
              <Link
                key={company.id}
                href={`/company/${company.id}/tv/${nameToSlug(company.name)}?page=1`}
                className="flex flex-col justify-center items-center gap-2 bg-gray-900 hover:bg-gray-800
                  rounded-lg p-2 transition-colors w-full sm:w-auto min-h-[104px] grow relative"
              >
                {company?.logo_path ? (
                  <>
                    {!isImgLoaded && <BgPlaceholder />}
                    <div className="relative w-full sm:w-48 h-[64px]">
                      {company?.logo_path !== null && (
                        <Image
                          src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W200}${company.logo_path}`}
                          alt={company.name}
                          fill
                          className={`object-contain drop-shadow-[0_0_0.5px_white]
                            ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                            transition-[transform,opacity] duration-300 transform-gpu ease-out`}
                          loading="lazy"
                          onLoad={() =>
                            dispatch(setImageLoaded(company?.logo_path ?? ""))
                          }
                        />
                      )}
                    </div>
                    <h3 className="text-xs">{company.name}</h3>
                  </>
                ) : (
                  <span className="font-semibold flex items-center text-center">
                    {company.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </Accordion>
      {/* Seasons and Episodes */}
      <Accordion
        id="seasons-and-episodes"
        openedAccordion={openedAccordion}
        setOpenedAccordion={setOpenedAccordion}
        title={t("SeasonsAndEpisodes.Header")}
      >
        <div className="p-4 bg-gray-950 flex flex-wrap gap-2">
          {statsData(tvShow, t).map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>
      </Accordion>
      {/* status */}
      <Accordion
        id="status"
        openedAccordion={openedAccordion}
        setOpenedAccordion={setOpenedAccordion}
        title={t("Status.Header")}
      >
        <div className="p-4 bg-gray-950 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex gap-3 items-center bg-gray-900 p-4 rounded-lg">
            <FcCalendar className="text-2xl sm:text-3xl" />
            <div>
              <h4 className="text-blue-300 text-sm font-light mb-1">
                {t("Status.ReleaseStatus")}
              </h4>
              <p className="text-white font-semibold text-lg">
                {isArabic
                  ? (releaseStatusMap(t)[tvShow?.status ?? ""] ??
                    tvShow?.status ??
                    "N/A")
                  : (tvShow?.status ?? "N/A")}
              </p>
            </div>
          </div>
          <div className="flex gap-3 items-center bg-gray-900 p-4 rounded-lg">
            <FcGlobe className="text-2xl sm:text-3xl" />
            <div>
              <h4 className="text-blue-300 text-sm font-light mb-1">
                {t("Status.OriginalLanguage")}
              </h4>
              <p className="text-white font-semibold text-lg">
                {tvShow?.original_language.toUpperCase() || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Accordion>
      {/* Spoken Languages */}
      {tvShow?.spoken_languages?.length > 0 && (
        <Accordion
          id="spoken-languages"
          openedAccordion={openedAccordion}
          setOpenedAccordion={setOpenedAccordion}
          title={t("SpokenLanguages")}
        >
          <div className="p-4 bg-gray-950 flex flex-wrap gap-2">
            {tvShow?.spoken_languages?.map((lang, idx) => (
              <span
                key={idx}
                className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm"
              >
                {lang?.[isArabic ? "name" : "english_name"] ??
                  lang?.name ??
                  lang?.english_name ??
                  "Unknown"}
              </span>
            ))}
          </div>
        </Accordion>
      )}
      {/* Production Countries */}
      {tvShow?.production_countries?.length > 0 && (
        <Accordion
          id="production-countries"
          openedAccordion={openedAccordion}
          setOpenedAccordion={setOpenedAccordion}
          title={t("ProductionCountries")}
        >
          <div className="p-4 bg-gray-950 flex flex-wrap gap-2">
            {tvShow?.production_countries?.map((country, idx) => (
              <span
                key={idx}
                className="bg-gray-900 text-white px-3 py-1 rounded-full text-sm"
              >
                {country.name || "Unknown"}
              </span>
            ))}
          </div>
        </Accordion>
      )}
    </div>
  );
};

export default MoreTvDetails;
