import { MovieDetailsResponse } from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import Title from "../Title/Title";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { nameToSlug } from "../../../../helpers/helpers";

const MovieCollectionBanner = ({
  movie,
  t,
}: {
  movie: MovieDetailsResponse;
  t: any;
}) => {
  if (!movie?.belongs_to_collection) return null;
  return (
    <div className="my-10">
      <Title title={t("Collections.header")} />
      <div className="relative w-full h-80 rounded-lg overflow-hidden block border border-gray-800">
        {/* backdrop */}
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}/${movie?.belongs_to_collection?.backdrop_path}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={movie?.belongs_to_collection?.name}
          className={"rounded-lg w-full object-cover object-top"}
        />
        {/* layer with content */}
        <div
          className="relative z-10 flex flex-col justify-center items-center text-center gap-6 p-2
            xs:p-4 sm:p-6 h-full bg-black/80"
        >
          <div>
            <h2 className="text-2xl font-bold">
              {t("Collections.title", {
                collectionName: movie?.belongs_to_collection?.name,
              })}
            </h2>
            <p className="text-gray-300 mt-1.5">
              {t("Collections.description", {
                collectionName: movie?.belongs_to_collection?.name,
              })}
            </p>
          </div>
          <Link
            href={`/collection/${movie?.belongs_to_collection?.id}/${nameToSlug(movie?.belongs_to_collection?.name)}`}
            className="px-4 py-2 border border-transparent text-blue-500 bg-gray-800
              hover:bg-gray-800/50 hover:border hover:border-blue-500 rounded-full
              font-semibold transition-colors duration-200"
          >
            {t("Collections.button")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCollectionBanner;
