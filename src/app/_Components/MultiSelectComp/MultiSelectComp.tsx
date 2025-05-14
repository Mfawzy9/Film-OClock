import { useRouter as useNextIntlRouter } from "@/i18n/navigation";
import { useRouter } from "@bprogress/next/app";
import { useTranslations } from "next-intl";
import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { IoClose, IoSearch } from "react-icons/io5";

interface MultiSelectCompProps {
  items: { query: string; name: string }[];
  activeSelect: { query: string; name: string }[];
  setActiveSelect: (selectedOptions: { query: string; name: string }[]) => void;
  label?: string;
  className?: string;
  setPage?: React.Dispatch<React.SetStateAction<number>>;
  defaultOption?: string;
}

const MultiSelectComp = ({
  items,
  activeSelect,
  setActiveSelect,
  label,
  className,
  setPage,
  defaultOption,
}: MultiSelectCompProps) => {
  const t = useTranslations("AllShows");
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter({ customRouter: useNextIntlRouter });

  // Memoize filtered items to prevent unnecessary recalculations
  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(term));
  }, [items, searchTerm]);

  // Memoize active select queries for quick lookup
  const activeSelectQueries = useMemo(
    () => new Set(activeSelect.map((item) => item.query)),
    [activeSelect],
  );

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Memoized handler for selecting options
  const handleSelectOption = useCallback(
    (query: string, name: string) => {
      if (activeSelectQueries.has(query)) {
        setActiveSelect(activeSelect.filter((item) => item.query !== query));
      } else {
        setActiveSelect([...activeSelect, { query, name }]);
      }
      router.push(`?page=${1}`, { scroll: false });
      setPage?.(1);
      setSearchTerm("");
      inputRef.current?.focus();
    },
    [activeSelect, activeSelectQueries, setActiveSelect, setPage, router],
  );

  // Memoized handler for removing selected items
  const removeSelectedItem = useCallback(
    (query: string) => {
      setActiveSelect(activeSelect.filter((item) => item.query !== query));
    },
    [activeSelect, setActiveSelect],
  );

  // Optimized dropdown toggle with focus management
  const handleDropdownToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (!isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  return (
    <div className="relative w-52 xs:w-60" ref={dropdownRef}>
      <label
        className={`text-gray-300 pointer-events-none px-1 text-xs absolute -top-2 start-2
          bg-gray-900 rounded-full z-10 ${className}`}
      >
        {label}
      </label>
      <div
        className="px-4 pb-2 pt-3 border border-gray-600 rounded-lg [box-shadow:0_0_3px_#1c64f2]
          bg-gray-900 text-gray-200 focus:ring-2 focus:ring-blue-700 focus:border-blue-700
          cursor-pointer min-h-[46px]"
        onClick={handleDropdownToggle}
      >
        {activeSelect.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {activeSelect.map((item) => (
              <span
                key={item.query}
                className="bg-blue-700 text-white text-sm px-2 py-1 rounded flex items-center gap-1"
              >
                {item.name}
                <IoClose
                  className="cursor-pointer hover:text-gray-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSelectedItem(item.query);
                  }}
                />
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400">{defaultOption}</span>
        )}
      </div>

      {isOpen && (
        <div
          className="absolute mt-1 w-full bg-gray-900 border border-gray-600 rounded-md shadow-md
            max-h-80 overflow-y-auto z-40 custom-scrollbar"
        >
          <div className="sticky top-0 bg-gray-900 p-2 border-b border-gray-600">
            <div className="relative">
              <IoSearch className="absolute start-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder={t("Filters.Genres.SearchPlaceholder")}
                className="w-full ps-10 pe-4 py-1.5 bg-gray-800 text-gray-200 rounded-md focus:outline-none
                  focus:ring-1 focus:ring-blue-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-64">
            {filteredItems.length > 0 ? (
              filteredItems.map((type) => (
                <div
                  key={type.query}
                  className={`px-4 py-2 text-gray-200 cursor-pointer ${
                    activeSelectQueries.has(type.query)
                      ? "bg-blue-700"
                      : "hover:bg-gray-700"
                    }`}
                  onClick={() => handleSelectOption(type.query, type.name)}
                >
                  {type.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-gray-400">
                {t("Filters.Genres.SearchNotFound")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSelectComp;
