import { FaMoneyBill } from "@react-icons/all-files/fa/FaMoneyBill";
import { FcGlobe } from "@react-icons/all-files/fc/FcGlobe";
import { AiFillDollarCircle } from "@react-icons/all-files/ai/AiFillDollarCircle";
import Accordion from "../Accordion/Accordion";
import { MovieDetailsResponse } from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import Image from "next/image";
import { formatCurrency, nameToSlug } from "../../../../helpers/helpers";
import { FcCalendar } from "@react-icons/all-files/fc/FcCalendar";
import { useTranslations } from "next-intl";
import { releaseStatusMap } from "../TvDetails/MoreTvDetails";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { RootState } from "@/lib/Redux/store";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { Link } from "@/i18n/navigation";

interface MoreMovieDetailsProps {
  movie: MovieDetailsResponse;
  openedAccordion: string | null;
  setOpenedAccordion: React.Dispatch<React.SetStateAction<string | null>>;
  isArabic: boolean;
}

const MoreMovieDetails = ({
  movie,
  openedAccordion,
  setOpenedAccordion,
  isArabic,
}: MoreMovieDetailsProps) => {
  const t = useTranslations("MovieDetails.Tabs.MoreInfo");
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
          {movie?.production_companies?.map((company) => {
            const isImgLoaded =
              company?.logo_path && loadedImgs[company?.logo_path];
            return (
              <Link
                key={company.id}
                href={`/company/${company.id}/movie/${nameToSlug(company.name)}?page=1`}
                className="flex flex-col justify-center items-center gap-2 bg-gray-900 hover:bg-gray-800
                  rounded-lg p-2 transition-colors w-full sm:w-auto min-h-[104px] grow relative"
              >
                {company.logo_path ? (
                  <>
                    {!isImgLoaded && <BgPlaceholder />}
                    <div className="relative w-full sm:w-48 h-[64px]">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W200}${company.logo_path}`}
                        alt={company.name}
                        fill
                        className={`object-contain drop-shadow-[0_0_0.5px_white]
                          ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                          transition-[transform,opacity] duration-300 transform-gpu ease-out`}
                        loading="lazy"
                        onLoad={() =>
                          dispatch(setImageLoaded(company.logo_path ?? ""))
                        }
                      />
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
      {/* Financial Information */}
      <Accordion
        id="financial-info"
        openedAccordion={openedAccordion}
        setOpenedAccordion={setOpenedAccordion}
        title={t("FinancialInformation.Header")}
      >
        <div className="p-4 bg-gray-950 grid grid-cols-1 md:grid-cols-2 gap-4">
          {["budget", "revenue"].map((key) => (
            <div
              key={key}
              className="bg-gray-900 p-4 rounded-lg flex items-center gap-3"
            >
              {key === "budget" ? (
                <FaMoneyBill className="text-3xl text-blue-300" />
              ) : (
                <AiFillDollarCircle className="text-3xl text-blue-300" />
              )}

              <div key={key}>
                <h4 className="text-blue-300 text-sm font-medium mb-1">
                  {key === "budget"
                    ? t("FinancialInformation.Budget")
                    : t("FinancialInformation.Revenue")}
                </h4>
                <p className="text-white text-lg font-semibold">
                  {movie?.[key as keyof MovieDetailsResponse]
                    ? formatCurrency(
                        movie[key as keyof MovieDetailsResponse] as number,
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
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
                  ? (releaseStatusMap(t)[movie?.status ?? ""] ??
                    movie?.status ??
                    "N/A")
                  : (movie?.status ?? "N/A")}
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
                {movie?.original_language.toUpperCase() || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </Accordion>
      {/* Spoken Languages */}
      {movie.spoken_languages.length > 0 && (
        <Accordion
          id="spoken-languages"
          openedAccordion={openedAccordion}
          setOpenedAccordion={setOpenedAccordion}
          title={t("SpokenLanguages")}
        >
          <div className="p-4 bg-gray-950 flex flex-wrap gap-2">
            {movie?.spoken_languages?.map((lang, idx) => (
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
      {movie.production_countries.length > 0 && (
        <Accordion
          id="production-countries"
          openedAccordion={openedAccordion}
          setOpenedAccordion={setOpenedAccordion}
          title={t("ProductionCountries")}
        >
          <div className="p-4 bg-gray-950 flex flex-wrap gap-2">
            {movie?.production_countries?.map((country, idx) => (
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

export default MoreMovieDetails;
