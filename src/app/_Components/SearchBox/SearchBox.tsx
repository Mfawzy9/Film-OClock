"use client";
import { useLazyGetSearchQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import debounce from "lodash/debounce";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SearchMultiTVShow,
  SearchMultiPerson,
  SearchMultiMovie,
} from "@/app/interfaces/apiInterfaces/SearchMultiInterfaces";
import { useRouter as useNextIntlRouter } from "@/i18n/navigation";
import {
  getShowTitle,
  nameToSlug,
  scrollToTop,
} from "../../../../helpers/helpers";
import { useTranslations } from "next-intl";
import useIsArabic from "@/app/hooks/useIsArabic";
import { useRouter } from "@bprogress/next/app";
import { useParams } from "next/navigation";
import { AiOutlineFileSearch } from "@react-icons/all-files/ai/AiOutlineFileSearch";
import { FaSearch } from "@react-icons/all-files/fa/FaSearch";
import { IoClose } from "@react-icons/all-files/io5/IoClose";
import ResultContent from "./ResultContent";

export type SearchResult =
  | SearchMultiPerson
  | SearchMultiTVShow
  | SearchMultiMovie;

// Type guards
export const isPerson = (result: SearchResult): result is SearchMultiPerson =>
  result.media_type === "person";
export const isMovie = (result: SearchResult): result is SearchMultiMovie =>
  result.media_type === "movie";
export const isTVShow = (result: SearchResult): result is SearchMultiTVShow =>
  result.media_type === "tv";

const SearchBox = () => {
  const router = useRouter({ customRouter: useNextIntlRouter });
  const params = useParams<{ locale: "en" | "ar"; query: string }>();
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
                lang: isArabic ? "ar" : "en",
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
    [search, isArabic],
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

  const handleSubmit = useCallback(
    async (
      e:
        | React.FormEvent<HTMLFormElement>
        | React.MouseEvent<HTMLButtonElement>
        | React.KeyboardEvent<HTMLInputElement>
        | React.MouseEvent<HTMLAnchorElement>,
    ) => {
      e.preventDefault();
      closeSearch();
      const isSameQuery = decodeURIComponent(params.query) === query;

      if (query && !isSameQuery) {
        try {
          const { data } = await search(
            { query, lang: isArabic ? "ar" : "en" },
            true,
          );

          const resultCount = data?.results?.length ?? 0;

          router.push(`/Search/${query}?page=1&results=${resultCount}`);
          setQuery("");
          scrollToTop();
        } catch (error) {
          console.error("Search failed during submit:", error);
        }
      }
    },
    [params.query, query, search, router, isArabic],
  );
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const totalResults = results.length + (results.length >= 20 ? 1 : 0);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!results.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          if (prev === null || prev >= totalResults - 1) return 0;
          return prev + 1;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => {
          if (prev === null || prev <= 0) return totalResults - 1;
          return prev - 1;
        });
      } else if (e.key === "Enter" && highlightedIndex !== null) {
        e.preventDefault();

        if (highlightedIndex === results.length) {
          handleSubmit(e);
          setIsResultsContainerOpen(false);
          setQuery("");
          setHighlightedIndex(null);
          return;
        }

        const item = results[highlightedIndex];
        if (item) {
          const title = isMovie(item)
            ? getShowTitle({ isArabic, show: item }) || item.original_title
            : isTVShow(item)
              ? getShowTitle({ isArabic, show: item }) || item.original_name
              : item.name;

          router.push(
            `/details/${item.media_type}/${item.id}/${nameToSlug(title)}`,
          );
          setIsResultsContainerOpen(false);
          setQuery("");
          setHighlightedIndex(null);
        }
      }
    },
    [results, isArabic, router, highlightedIndex, totalResults, handleSubmit],
  );

  useEffect(() => {
    setHighlightedIndex(null);
  }, [results]);

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
              <IoClose
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
                <AiOutlineFileSearch className="text-2xl" />
              </button>

              <input
                autoFocus={isMobileSearchOpen}
                onKeyDown={handleKeyDown}
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
              border-gray-800 rounded-lg custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <ResultContent
              setHighlightedIndex={setHighlightedIndex}
              highlightedIndex={highlightedIndex}
              closeSearchAndClear={closeSearchAndClear}
              isLoading={isLoading}
              isFetching={isFetching}
              results={results}
              isArabic={isArabic}
              handleSubmit={handleSubmit}
              query={query}
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
            onKeyDown={handleKeyDown}
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
              <AiOutlineFileSearch className="text-2xl" />
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
              overflow-y-auto custom-scrollbar shadow-blueGlow shadow-blue-700/50`}
              onClick={(e) => e.stopPropagation()}
            >
              <ResultContent
                setHighlightedIndex={setHighlightedIndex}
                highlightedIndex={highlightedIndex}
                closeSearchAndClear={closeSearchAndClear}
                results={results}
                isLoading={isLoading}
                isFetching={isFetching}
                isArabic={isArabic}
                handleSubmit={handleSubmit}
                query={query}
              />
            </div>
          </>
        )}
      </form>
    </>
  );
};

export default SearchBox;
