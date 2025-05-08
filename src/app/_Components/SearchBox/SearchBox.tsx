import { useLazyGetSearchQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { debounce } from "lodash";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { Link } from "@/i18n/navigation";
import {
  SearchMultiTVShow,
  SearchMultiPerson,
  SearchMultiMovie,
} from "@/app/interfaces/apiInterfaces/SearchMultiInterfaces";
import { SiSpinrilla } from "react-icons/si";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { useRouter } from "@/i18n/navigation";
import { MdManageSearch } from "react-icons/md";
import { nameToSlug, scrollToTop } from "../../../../helpers/helpers";
import { useTranslations } from "next-intl";
import useIsArabic from "@/app/hooks/useIsArabic";

type SearchResult = SearchMultiPerson | SearchMultiTVShow | SearchMultiMovie;

const SearchBox = () => {
  const router = useRouter();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isResultsContainerOpen, setIsResultsContainerOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [search, { isFetching, isLoading }] = useLazyGetSearchQuery();
  const t = useTranslations("Navbar");
  const { isArabic } = useIsArabic();

  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchQuery: string) => {
        if (searchQuery.trim()) {
          try {
            const { data } = await search(
              {
                query: searchQuery,
              },
              true,
            );
            setResults(data?.results || []);
          } catch (error) {
            console.error("Search error:", error);
          }
        } else {
          setResults([]);
        }
      }, 500),
    [search],
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const searchTerm = e.target.value;
      if (searchTerm === query) return;
      if (searchTerm.length > 0) {
        setIsResultsContainerOpen(true);
        setQuery(searchTerm);
        debouncedSearch(searchTerm);
      } else {
        setIsResultsContainerOpen(false);
        setResults([]);
        setQuery("");
      }
    },
    [debouncedSearch, query],
  );

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.length > 0) {
      setQuery(e.target.value);
      setIsResultsContainerOpen(true);
    }
  };

  const closeSearch = () => {
    setIsMobileSearchOpen(false);
    setIsResultsContainerOpen(false);
  };

  const closeSearchAndClear = () => {
    closeSearch();
    setQuery("");
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    closeSearch();

    if (query) {
      router.push(`/Search/${query}?page=1`);
      setQuery("");
      scrollToTop();
    }
  };
  return (
    <>
      {/* Mobile search box */}
      <div className="mx-auto text-xl sm:hidden">
        <FaSearch
          role="button"
          onClick={() => setIsMobileSearchOpen(true)}
          className="mx-auto"
        />

        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.form
              initial={{ y: "-100px" }}
              animate={{ y: 0 }}
              exit={{ y: "-100px" }}
              className="absolute z-50 inset-0 max-h-[55px]"
              onSubmit={handleSubmit}
            >
              <FaSearch className="absolute top-1/2 transform -translate-y-1/2 start-3 z-40" />
              <FaXmark
                role="button"
                onClick={closeSearchAndClear}
                aria-label="close"
                className={`absolute ${query ? "end-14" : "end-2"} transition-all duration-300 top-1/2
                transform -translate-y-1/2 hover:bg-gray-800`}
              />

              <button
                className={`absolute top-2 ${query ? "end-2" : "-end-full"} transition-all duration-300
                bottom-2 w-10 flex justify-center items-center transform hover:bg-blue-800
                bg-blue-700 rounded`}
                onClick={handleSubmit}
              >
                <MdManageSearch className="text-2xl" />
              </button>

              <input
                autoFocus={isMobileSearchOpen}
                type="search"
                className="h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
                  focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-black
                  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
                  dark:focus:ring-blue-500 dark:focus:border-blue-500 focus-visible:outline-none"
                placeholder={t("SearchPlaceholder")}
                required
                onChange={handleSearch}
                value={query || ""}
                onFocus={onFocus}
              />
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile search results */}
      {isMobileSearchOpen && isResultsContainerOpen && (
        <main className="fixed inset-0 bg-black/20" onClick={closeSearch}>
          <div
            className="fixed top-20 start-2 end-2 sm:hidden bg-black max-h-96 overflow-y-auto border-2
              border-gray-800 rounded-lg scroll-hidden shadow-blueGlow shadow-blue-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            {results.length >= 20 && !isLoading && !isFetching && (
              <button className="w-full" onClick={handleSubmit}>
                <p className="text-center py-2 hover:bg-gray-800">
                  {t("AllSearchResults", { query })} &quot;{query}&quot;
                </p>
              </button>
            )}
            <ResultContent
              closeSearchAndClear={closeSearchAndClear}
              isLoading={isLoading}
              isFetching={isFetching}
              results={results}
            />
          </div>
        </main>
      )}

      {/* Desktop search box */}
      <form
        onSubmit={handleSubmit}
        className="items-center w-full hidden sm:flex max-w-[240px] md:max-w-[300px] xl:max-w-md
          mx-auto md:mx-0 relative"
      >
        <div className="relative w-full">
          <div className="flex absolute z-20 inset-y-0 start-0 items-center ps-3 pointer-events-none">
            <FaSearch />
          </div>
          <input
            type="search"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
              focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-black
              dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
              dark:focus:ring-blue-500 dark:focus:border-blue-500 focus-visible:outline-none
              relative z-10"
            placeholder={t("SearchPlaceholder")}
            required
            onChange={handleSearch}
            onFocus={onFocus}
            value={query || ""}
          />

          <>
            {query && (
              <span
                className={`absolute ${query ? "end-14" : "end-2"} transition-all duration-300 top-1/2
                transform -translate-y-1/2 hover:bg-gray-800 z-10 cursor-pointer`}
                onClick={closeSearchAndClear}
              >
                ✖
              </span>
            )}

            <button
              className={`absolute end-2 ${query ? "top-2 opacity-100 " : "-top-[100vh] opacity-0"}
                transition-all duration-300 w-10 h-[26px] flex justify-center items-center
                hover:bg-blue-800 bg-blue-700 rounded z-10`}
              type="submit"
            >
              <MdManageSearch className="text-2xl" />
            </button>
          </>
        </div>

        {/* Desktop search results */}
        {isResultsContainerOpen && (
          <>
            <main className="fixed inset-0 bg-black/20" onClick={closeSearch} />
            <div
              className={`fixed lg:absolute top-20 lg:top-12 w-full md:w-[70%] lg:w-[200%] xl:w-[150%]
              ${isArabic ? "end-1/2" : "start-1/2"} lg:start-0 transform -translate-x-1/2
              lg:translate-x-0 bg-black max-h-96 border-2 border-gray-800 rounded-lg min-h-20
              overflow-y-auto scroll-hidden shadow-blueGlow shadow-blue-700/50`}
              onClick={(e) => e.stopPropagation()}
            >
              {results.length >= 20 && !isLoading && !isFetching && (
                <button className="w-full" onClick={handleSubmit}>
                  <p className="text-center py-2 border-b border-gray-700 hover:bg-gray-900">
                    {t("AllSearchResults", { query: query })} &quot;{query}
                    &quot;
                  </p>
                </button>
              )}
              <ResultContent
                closeSearchAndClear={closeSearchAndClear}
                results={results}
                isLoading={isLoading}
                isFetching={isFetching}
              />
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default SearchBox;

interface ResultContentProps {
  results: SearchResult[];
  isLoading: boolean;
  isFetching: boolean;
  closeSearchAndClear: () => void;
}
const ResultContent = ({
  results,
  isLoading,
  isFetching,
  closeSearchAndClear,
}: ResultContentProps) => {
  const t = useTranslations("Navbar");
  const tPerson = useTranslations("PopularPeople.Person.PersonCard");

  const editedPersonJob = useMemo(() => {
    return (personJob: string) => {
      return personJob === "Acting"
        ? tPerson("Acting")
        : personJob === "Directing"
          ? tPerson("Directing")
          : personJob === "Producing"
            ? tPerson("Producing")
            : "";
    };
  }, [tPerson]);
  // Type guards
  const isPerson = (result: SearchResult): result is SearchMultiPerson =>
    result.media_type === "person";
  const isMovie = (result: SearchResult): result is SearchMultiMovie =>
    result.media_type === "movie";
  const isTVShow = (result: SearchResult): result is SearchMultiTVShow =>
    result.media_type === "tv";
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
        results.map((result) => {
          // Get media-specific data in a type-safe way
          const title = isMovie(result)
            ? result.title || result.original_title
            : isTVShow(result)
              ? result.name || result.original_name
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
              key={result.id}
              href={`/details/${result.media_type}/${result.id}/${nameToSlug(title)}`}
              className="flex items-center gap-2 p-2 hover:bg-gray-900"
              onClick={closeSearchAndClear}
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
        })
      ) : (
        <p className="text-center py-3">{t("SearchNotFound")}</p>
      )}
    </>
  );
};
