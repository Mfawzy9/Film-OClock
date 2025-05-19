import { MovieCollectionResponse } from "@/app/interfaces/apiInterfaces/movieCollectionInterfaces";
import { MovieCollectionTranslationsResponse } from "@/app/interfaces/apiInterfaces/movieCollectionTranslationsInterfaces";
import Image from "next/image";
import PageSection from "../PageSection/PageSection";
import { Movie } from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import ScrollToSection from "../ScrollToSection/ScrollToSection";
import CardsSlider from "../CardsSlider/CardsSlider";

interface MovieCollectionCompProps {
  collectionDetails: MovieCollectionResponse | null;
  collectionTranslations: MovieCollectionTranslationsResponse | null;
  locale: "en" | "ar";
}
const MovieCollectionComp = ({
  collectionDetails,
  collectionTranslations,
  locale,
}: MovieCollectionCompProps) => {
  const finalOverview = () => {
    if (collectionDetails && collectionTranslations) {
      const arabicSaOverview = collectionTranslations.translations
        .find(
          (translation) =>
            translation.iso_639_1 === "ar" && translation.iso_3166_1 === "SA",
        )
        ?.data?.overview.trim();
      const arabicAeOverview = collectionTranslations.translations
        .find(
          (translation) =>
            translation.iso_639_1 === "ar" && translation.iso_3166_1 === "AE",
        )
        ?.data?.overview.trim();
      return arabicSaOverview || arabicAeOverview || collectionDetails.overview;
    } else {
      return collectionDetails?.overview || null;
    }
  };

  return (
    <>
      {/* layer and bg */}
      <div className="min-h-screen absolute w-full -z-10">
        <Image
          src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}${collectionDetails?.backdrop_path}`}
          alt={collectionDetails?.name || "background"}
          fill
          priority
          className="object-cover object-top"
        />
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute inset-0 bg-black/80" />
      </div>
      {/* content */}
      <PageSection className="md:!py-0">
        <div
          className={`flex flex-col min-h-screen 4xl:min-h-[unset] md:flex-row items-center
            justify-center relative md:pt-32 gap-6 4xl:pt-48`}
        >
          {/* collection Poster */}
          <div className="sm:w-[300px] sm:h-fit mx-auto md:mx-0 flex-none relative flex flex-col gap-4">
            <div className="absolute inset-0 bg-gray-700 animate-pulse rounded-md" />
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${collectionDetails?.poster_path}`}
              width={300}
              height={450}
              alt={`${collectionDetails?.name || "collection"} Poster`}
              priority
              className={"sm:w-[300px] sm:h-[450px] rounded-t-md relative z-10"}
            />
          </div>

          {/* collection Info */}
          <div className="flex flex-col gap-10">
            <h2 className="text-4xl font-righteous flex gap-3 items-center ps-2 border-s-4 border-blue-700">
              {collectionDetails?.name}
            </h2>

            {finalOverview() && (
              <div>
                <h4 className="font-bold text-xl mb-1">
                  {locale === "en" ? "Overview" : "الملخص"}
                </h4>
                <p
                  className={
                    "tracking-wide leading-relaxed text-gray-200 text-sm "
                  }
                >
                  {finalOverview()}
                </p>
              </div>
            )}
          </div>
          <ScrollToSection className="hidden md:block 4xl:hidden" />
        </div>

        {collectionDetails?.parts && collectionDetails.parts.length > 0 && (
          <CardsSlider
            showType="movie"
            sliderType="movies"
            theShows={(collectionDetails?.parts as Movie[]) || []}
            title={locale === "en" ? "Collection Movies" : "أفلام السلسلة"}
            className="my-16"
            arrLength={collectionDetails.parts.length}
          />
        )}
      </PageSection>
    </>
  );
};

export default MovieCollectionComp;
