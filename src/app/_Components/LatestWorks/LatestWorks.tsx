"use client";
import { Link } from "@/i18n/navigation";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import {
  PersonDetailsResponse,
  PMovieCast,
  PMovieCrew,
  PTvCast,
  PTvCrew,
} from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import { useMemo } from "react";
import Image from "next/image";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { nameToSlug } from "../../../../helpers/helpers";

function getDetailsLink(work: PMovieCast | PMovieCrew | PTvCast | PTvCrew) {
  const title =
    (work as PMovieCast | PMovieCrew).original_title ||
    (work as PTvCast | PTvCrew).original_name ||
    "";

  const slug = nameToSlug(title);
  return `/details/${work.media_type}/${work.id}/${slug}`;
}

const LatestWorks = ({
  person,
  label,
}: {
  person: PersonDetailsResponse;
  label: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const loadedImgs = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs,
    shallowEqual,
  );

  // Get latest works (movies & TV shows) sorted by date
  const latestWorks = useMemo(() => {
    if (!person?.combined_credits) return [];

    return [
      ...(person.combined_credits.cast || []),
      ...(person.combined_credits.crew || []),
    ]
      .filter(
        (work) =>
          (work as PMovieCast).release_date || (work as PTvCast).first_air_date, // Ensure valid dates
      )
      .filter((work) => work.poster_path) // Ignore works without `poster_path`
      .sort((a, b) => {
        const dateA = new Date(
          (a as PMovieCast).release_date || (a as PTvCast).first_air_date,
        ).getTime();
        const dateB = new Date(
          (b as PMovieCast).release_date || (b as PTvCast).first_air_date,
        ).getTime();
        return dateB - dateA; // Sort descending (latest first)
      })
      .filter(
        (work, index, self) =>
          index === self.findIndex((w) => w.id === work.id), // Remove duplicates based on `id`
      )
      .slice(0, 5); // Get the latest 5 unique works
  }, [person]);

  return (
    <>
      <main className="flex flex-col gap-2">
        <h2
          className="italic relative after:content-[''] after:absolute after:-bottom-1 after:start-0
            after:w-12 after:h-1 after:bg-blue-800 mb-2"
        >
          {label}
        </h2>
        <div className="flex flex-wrap gap-2">
          {latestWorks?.map((work, idx) => {
            const isImgLoaded = loadedImgs[work?.poster_path];
            return (
              <Link key={idx} href={getDetailsLink(work)} className="group">
                <div
                  key={idx}
                  className="w-[75px] h-[110px] flex-none relative rounded-md"
                >
                  {!isImgLoaded && <BgPlaceholder />}
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W200}${work?.poster_path}`}
                    fill
                    sizes="100%"
                    alt={
                      (work as PMovieCast | PMovieCrew)?.original_title ||
                      (work as PTvCast | PTvCrew)?.original_name ||
                      ""
                    }
                    loading="lazy"
                    className={`rounded-md w-auto h-auto object-cover group-hover:scale-110
                    ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                    transition-[transform,opacity] duration-300 transform-gpu ease-out `}
                    onLoad={() => dispatch(setImageLoaded(work?.poster_path))}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
};

export default LatestWorks;
