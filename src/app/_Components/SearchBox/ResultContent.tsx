import { SiSpinrilla } from "@react-icons/all-files/si/SiSpinrilla";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRef, useEffect, useMemo, memo } from "react";
import { getShowTitle, nameToSlug } from "../../../../helpers/helpers";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { SearchResult, isMovie, isTVShow, isPerson } from "./SearchBox";
import Image from "next/image";

interface ResultContentProps {
  results: SearchResult[];
  isLoading: boolean;
  isFetching: boolean;
  closeSearchAndClear: () => void;
  isArabic: boolean;
  query: string;
  handleSubmit: (e: React.MouseEvent<HTMLAnchorElement>) => Promise<void>;
  highlightedIndex: number | null;
  setHighlightedIndex: React.Dispatch<React.SetStateAction<number | null>>;
}
const ResultContent = ({
  results,
  isLoading,
  isFetching,
  closeSearchAndClear,
  isArabic,
  query,
  handleSubmit,
  highlightedIndex,
  setHighlightedIndex,
}: ResultContentProps) => {
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const t = useTranslations("Navbar");
  const tPerson = useTranslations("PopularPeople.Person.PersonCard");

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, results.length + 1);
  }, [results.length]);

  useEffect(() => {
    if (
      highlightedIndex !== null &&
      itemRefs.current[highlightedIndex] !== null
    ) {
      itemRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [highlightedIndex]);

  const editedPersonJob = useMemo(() => {
    return (personJob: string) => {
      switch (personJob) {
        case "Acting":
          return tPerson("Acting");
        case "Directing":
          return tPerson("Directing");
        case "Producing":
          return tPerson("Producing");
        default:
          return "";
      }
    };
  }, [tPerson]);

  if (isFetching || isLoading)
    return (
      <span className="text-center flex justify-center items-center h-full py-6">
        <SiSpinrilla className="animate-spin text-5xl text-blue-200" />
      </span>
    );

  return (
    <>
      {/* Search result item */}
      {results.length > 0 ? (
        <>
          {results.map((result, idx) => {
            const title = isMovie(result)
              ? getShowTitle({ isArabic, show: result }) ||
                result.original_title
              : isTVShow(result)
                ? getShowTitle({ isArabic, show: result }) ||
                  result.original_name
                : result.name;

            const dateOrJob = isMovie(result)
              ? result.release_date
              : isTVShow(result)
                ? result.first_air_date
                : editedPersonJob(result.known_for_department);

            const imagePath = isPerson(result)
              ? result.profile_path
              : result.poster_path;
            return (
              <Link
                ref={(el) => {
                  itemRefs.current[idx] = el;
                }}
                key={result.id}
                href={`/details/${result.media_type}/${result.id}/${nameToSlug(title)}`}
                className={`flex items-center gap-2 p-2 ${
                  highlightedIndex === idx
                    ? "bg-blue-950/90"
                    : "hover:bg-gray-900"
                  }`}
                tabIndex={-1}
                onClick={() => {
                  closeSearchAndClear();
                  setHighlightedIndex(null);
                }}
              >
                {/* Poster */}
                <div className="w-14 h-20 relative">
                  {imagePath ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W200}${imagePath}`}
                      fill
                      sizes="56px"
                      className="object-cover"
                      alt={title}
                    />
                  ) : (
                    <BgPlaceholder />
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-col gap-1">
                  <h4 className="font-semibold line-clamp-1">{title}</h4>
                  <p className="text-xs text-gray-400">
                    {isMovie(result)
                      ? t("SearchMovie")
                      : isTVShow(result)
                        ? t("SearchTvShow")
                        : t("SearchPerson")}
                  </p>

                  {dateOrJob && (
                    <p className="text-xs text-gray-400">{dateOrJob}</p>
                  )}
                </div>
              </Link>
            );
          })}
          {results.length >= 20 && !isLoading && !isFetching && (
            <Link
              href={`/search/${encodeURIComponent(query)}`}
              ref={(el) => {
                itemRefs.current[results.length] = el;
              }}
              className={`flex items-center justify-center w-full py-2 border-t border-gray-700
                ${highlightedIndex === results.length ? "bg-blue-950/90" : "hover:bg-gray-900"}`}
              tabIndex={-1}
              onClick={(e) => {
                handleSubmit(e);
                closeSearchAndClear();
                setHighlightedIndex(null);
              }}
            >
              <p className="text-sm text-center font-medium">
                {t("AllSearchResults", { query })} &quot;{query}&quot;
              </p>
            </Link>
          )}
        </>
      ) : (
        <p className="text-center py-3">{t("SearchNotFound")}</p>
      )}
    </>
  );
};

export default memo(ResultContent);
