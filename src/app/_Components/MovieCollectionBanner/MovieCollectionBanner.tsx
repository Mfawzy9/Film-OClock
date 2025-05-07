import { MovieDetailsResponse } from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import Title from "../Title/Title";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { nameToSlug } from "../../../../helpers/helpers";
import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";

const MovieCollectionBanner = ({
  movie,
  className,
}: {
  movie: MovieDetailsResponse;
  className?: string;
}) => {
  const t = useTranslations("Collections");
  const dispatch = useDispatch<AppDispatch>();
  const isImgLoaded = useSelector(
    (state: RootState) =>
      state.imgPlaceholderReducer.loadedImgs[
        movie?.belongs_to_collection?.backdrop_path ?? ""
      ] || false,
  );

  if (!movie?.belongs_to_collection) return null;
  return (
    <div className={className ?? ""}>
      <Title title={t("header")} />
      <div className="relative w-full h-80 rounded-lg overflow-hidden block border border-gray-800">
        {!isImgLoaded && <BgPlaceholder />}
        {/* backdrop */}
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}/${movie?.belongs_to_collection?.backdrop_path}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt={movie?.belongs_to_collection?.name}
          className={`rounded-lg w-full object-cover object-top
            ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
            transition-[transform,opacity] duration-300 transform-gpu ease-out`}
          priority
          onLoad={() => {
            dispatch(
              setImageLoaded(movie?.belongs_to_collection?.backdrop_path ?? ""),
            );
          }}
        />
        {/* layer with content */}
        <div
          className="relative z-10 flex flex-col justify-center items-center text-center gap-6 p-2
            xs:p-4 sm:p-6 h-full bg-black/80"
        >
          <div>
            <h2 className="text-2xl font-bold">
              {t("title", {
                collectionName: movie?.belongs_to_collection?.name,
              })}
            </h2>
            <p className="text-gray-300 mt-1.5">
              {t("description", {
                collectionName: movie?.belongs_to_collection?.name,
              })}
            </p>
          </div>
          <Link
            scroll
            href={`/collection/${movie?.belongs_to_collection?.id}/${nameToSlug(movie?.belongs_to_collection?.name)}`}
            className="px-4 py-2 border border-transparent text-blue-500 bg-gray-800
              hover:bg-gray-800/50 hover:border hover:border-blue-500 rounded-full
              font-semibold transition-colors duration-200"
          >
            {t("button")}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieCollectionBanner;
