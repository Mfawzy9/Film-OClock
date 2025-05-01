import useIsArabic from "@/app/hooks/useIsArabic";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { TiChevronLeft, TiChevronRight } from "react-icons/ti";
import ReactPaginate from "react-paginate";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  isFetching: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  setPage,
  isLoading,
  isFetching,
}: PaginationProps) => {
  const { isArabic } = useIsArabic();
  const t = useTranslations("Pagination");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParam = Number(searchParams.get("page"));

  useEffect(() => {
    if (!pageParam) {
      router.push(`?page=1`, { scroll: false });
    }
    if (pageParam) {
      setPage(pageParam);
    }
  }, [pageParam, setPage, router]);

  const handlePageChange = useCallback(
    ({ selected }: { selected: number }) => {
      router.push(`?page=${selected + 1}`, { scroll: false });
      setPage(selected + 1);
      if (!isLoading && !isFetching)
        window.scrollTo({ top: 160, behavior: "smooth" });
    },
    [setPage, isLoading, isFetching, router],
  );

  return (
    <ReactPaginate
      containerClassName="flex justify-center items-center gap-2 mt-10"
      previousLabel={
        <div className="flex items-center gap-1 py-0.5 xs:py-1">
          {isArabic ? (
            <TiChevronRight className="group-hover:text-blue-700" />
          ) : (
            <TiChevronLeft className="group-hover:text-blue-700" />
          )}
          <span className="hidden sm:block font-righteous text-sm md:text-base">
            {t("Previous")}
          </span>
        </div>
      }
      previousClassName="block cursor-pointer sm:text-lg md:text-xl px-1.5 sm:px-4 py-0.5 sm:py-1  border border-gray-700 rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
      disabledClassName="opacity-50 cursor-not-allowed hover:bg-gray-900"
      disabledLinkClassName="cursor-not-allowed hover:bg-gray-900"
      nextLabel={
        <div className="flex items-center gap-1 py-0.5 xs:py-1">
          <span className="hidden sm:block font-righteous text-sm md:text-base">
            {t("Next")}
          </span>
          {isArabic ? (
            <TiChevronLeft className="group-hover:text-blue-700 font-extrabold" />
          ) : (
            <TiChevronRight className="group-hover:text-blue-700 font-extrabold" />
          )}
        </div>
      }
      nextClassName="block cursor-pointer sm:text-lg md:text-xl px-1.5 sm:px-4 py-0.5 sm:py-1  border border-gray-700 rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
      breakLabel={"..."}
      pageClassName={"inline-block"}
      pageLinkClassName={
        "block px-2 xs:px-3 sm:px-4 py-1 xs:py-1.5 font-bold text-xs sm:text-base md:text-lg border border-gray-700 rounded-md text-white bg-gray-900 hover:bg-gray-800 transition-colors"
      }
      activeLinkClassName="!bg-blue-600 rounded-md"
      activeClassName="bg-blue-600 rounded-md"
      pageCount={totalPages > 500 ? 500 : totalPages || 1}
      marginPagesDisplayed={1}
      pageRangeDisplayed={3}
      onPageChange={handlePageChange}
      forcePage={currentPage - 1}
    />
  );
};

export default Pagination;
