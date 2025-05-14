import { useCallback } from "react";
import Card from "../Card/Card";
import Title from "../Title/Title";
import {
  PopularPersonI,
  PopularPersonResponse,
} from "@/app/interfaces/apiInterfaces/popularMoviesTvInterfaces";
import { SiSpinrilla } from "react-icons/si";

interface props {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  isLoading: boolean;
  allData: PopularPersonI[];
  isFetching: boolean;
  data: PopularPersonResponse;
  t: any;
}

const baseImgUrl = process.env.NEXT_PUBLIC_BASE_IMG_URL_W500;

const AllPpl = ({
  page,
  setPage,
  isLoading,
  allData,
  isFetching,
  data,
  t,
}: props) => {
  const handleLoadMore = useCallback(() => {
    if (!isFetching) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, setPage]);
  return (
    <>
      {/* all cast */}
      <main className="mt-28">
        <div
          className="italic animate-pulse mb-10 mx-auto lg:mx-0 w-fit relative after:content-['']
            after:animate-bounce after:absolute after:-bottom-3 after:left-0 after:w-14
            lg:after:h-1 after:bg-blue-800"
        >
          <Title title={t("AllStars")} />
        </div>
        <div
          className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6
            xl:grid-cols-8 gap-2 xs:gap-4 place-items-center"
        >
          {allData?.map((person, idx) => {
            if (!person.profile_path) return null;
            return (
              <div key={person.id} className="">
                <Card
                  idx={idx}
                  personJob={person.known_for_department}
                  alt={person.name}
                  id={person.id}
                  name={person.name}
                  src={`${baseImgUrl}${person.profile_path}`}
                  showType="person"
                  rating={person.popularity}
                  ImgContainerHeight="min-h-56"
                />
              </div>
            );
          })}
        </div>
      </main>

      {/* load more */}
      {page === 500
        ? null
        : data?.total_pages &&
          page < data.total_pages && (
            <button
              disabled={isFetching || isLoading}
              onClick={handleLoadMore}
              className="bg-blue-800 text-white text-lg font-semibold px-4 py-2 rounded-md mt-5
                text-center mx-auto hover:bg-blue-950 transition-colors duration-200
                disabled:cursor-not-allowed disabled:bg-gray-600 w-full flex items-center
                justify-center gap-2"
            >
              {isFetching || isLoading ? (
                <span className="flex items-center gap-2">
                  <SiSpinrilla className="animate-spin text-2xl" />
                  {t("Loading")}
                </span>
              ) : (
                t("LoadMore")
              )}
            </button>
          )}
    </>
  );
};

export default AllPpl;
