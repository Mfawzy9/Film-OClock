"use client";
import { useTranslations } from "next-intl";
import { ChangeEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";

interface WlSearchProps {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  searchTerm: string;
  libraryWord: "Watchlist" | "Favourites" | "WatchedList";
}

const WlSearch = ({
  setSearchTerm,
  searchTerm,
  libraryWord,
}: WlSearchProps) => {
  const t = useTranslations("Library");
  return (
    <form className="relative max-w-sm my-6 mx-auto flex items-center">
      <FaSearch className="absolute top-1/2 transform -translate-y-1/2 start-3" />
      {searchTerm.length > 0 && (
        <FaXmark
          role="button"
          aria-label="close"
          className={`absolute transition-all duration-300 bg-black hover:bg-gray-800 top-1/2
          -translate-y-1/2 end-2 self-center`}
          onClick={() => setSearchTerm("")}
        />
      )}

      <input
        type="search"
        className="h-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-black
          dark:border-gray-600 dark:placeholder-gray-400 dark:text-white
          dark:focus:ring-blue-500 dark:focus:border-blue-500 focus-visible:outline-none"
        placeholder={t(`${libraryWord}.SearchPlaceholder`)}
        value={searchTerm}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearchTerm(e.target.value)
        }
      />
    </form>
  );
};

export default WlSearch;
