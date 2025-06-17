"use client";
import BgPlaceholder from "@/app/_Components/BgPlaceholder/BgPlaceholder";
import LatestWorks from "@/app/_Components/LatestWorks/LatestWorks";
import SocialLinks from "@/app/_Components/SocialLinks/SocialLinks";
import Title from "@/app/_Components/Title/Title";
import { useGetPersonDetailsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useMemo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import useIsArabic from "@/app/hooks/useIsArabic";
import { nameToSlug } from "../../../../helpers/helpers";
import { FaChevronCircleUp } from "@react-icons/all-files/fa/FaChevronCircleUp";
import { FaExternalLinkAlt } from "@react-icons/all-files/fa/FaExternalLinkAlt";
import { FcClapperboard } from "@react-icons/all-files/fc/FcClapperboard";
import { FcRating } from "@react-icons/all-files/fc/FcRating";
import { FcReading } from "@react-icons/all-files/fc/FcReading";
import dynamic from "next/dynamic";

const TopOneCardSkeleton = dynamic(() => import("./TopOneCardSkeleton"));

const TopOneCard = ({
  topOneObj: { id, topOneProfilePath },
}: {
  topOneObj: { id: number | null; topOneProfilePath: string };
}) => {
  const { isArabic } = useIsArabic();
  const t = useTranslations("PopularPeople");

  const dispatch = useDispatch<AppDispatch>();

  const {
    data: topOne,
    isLoading,
    isFetching,
  } = useGetPersonDetailsQuery({ personId: id || 0 }, { skip: !id });

  const editedPersonJob = useMemo(() => {
    const map: Record<string, string> = {
      Acting: t("Person.PersonCard.Acting"),
      Directing: t("Person.PersonCard.Directing"),
      Producing: t("Person.PersonCard.Producing"),
    };

    return topOne?.known_for_department
      ? map[topOne.known_for_department] || ""
      : "";
  }, [topOne?.known_for_department, t]);

  const isImgLoaded = useSelector(
    (state: RootState) =>
      state.imgPlaceholderReducer.loadedImgs[
        topOneProfilePath || topOne?.profile_path || ""
      ],
    shallowEqual,
  );

  if (isLoading || isFetching) return <TopOneCardSkeleton />;
  if (!topOne) return null;

  return (
    <section>
      <div
        className="italic animate-pulse mb-4 w-fit lg:-mb-6 relative after:content-['']
          after:animate-bounce after:absolute after:-bottom-3 after:start-0 after:w-14
          lg:after:h-1 after:bg-blue-800"
      >
        <Title
          title={t("TopOne.TopOneTitle")}
          className="!text-2xl xs:!text-3xl"
        />
      </div>
      <main className="flex flex-col lg:flex-row items-center rounded-md max-w-[992px] mx-auto">
        {/* top actor details */}
        <div
          className="bg-black flex flex-col gap-2 grow md:h-72 shadow-blueGlow -me-2 px-4 lg:ps-4
            lg:pe-6 py-2 rounded-md"
        >
          {/* Name and social links */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            {/* name and homepage */}
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-righteous">{topOne?.name}</h1>
              {topOne?.homepage && (
                <a
                  href={topOne?.homepage}
                  target="_blank"
                  className="hover:text-blue-700 cursor-pointer"
                >
                  <FaExternalLinkAlt title="Home page" className="text-base" />
                </a>
              )}
            </div>

            <SocialLinks externalIds={topOne?.external_ids} isPerson />
          </div>
          {/* Attributes */}
          <div className="flex items-center flex-wrap gap-4">
            <h4
              className="bg-gray-900 text-white px-3 py-2 text-sm rounded flex flex-col gap-2 border
                lg:grow border-gray-600"
            >
              <span className="text-gray-300">{t("TopOne.Popularity")}</span>
              <span className="flex items-center gap-1 font-bold">
                <FcRating className="text-lg" />{" "}
                {topOne?.popularity?.toFixed(1)}
              </span>
            </h4>
            <h4
              className="bg-gray-900 text-white px-3 py-2 text-sm rounded flex flex-col gap-2 border
                lg:grow border-gray-600"
            >
              <span className="text-gray-300">{t("TopOne.KnownAs")} </span>
              <span className="flex items-center gap-1 font-bold">
                <FcReading className="text-lg" /> {editedPersonJob}
              </span>
            </h4>
            <h4
              className="bg-gray-900 text-white px-3 py-2 text-sm rounded flex flex-col gap-2 border
                lg:grow border-gray-600"
            >
              <span className="text-gray-300">{t("TopOne.TotalWorks")}</span>
              <span className="flex items-center gap-1 font-bold">
                <FcClapperboard className="text-lg" />{" "}
                {topOne?.combined_credits?.crew.length +
                  topOne?.combined_credits?.cast.length}
              </span>
            </h4>
            <h4
              className="bg-gray-900 text-white px-3 py-2 text-sm rounded flex flex-col gap-2 border
                lg:grow border-gray-600"
            >
              <span className="text-gray-300">{t("TopOne.Birthday")}</span>
              <span className="flex items-center gap-1 font-bold">
                &#x1F382;{" "}
                {new Date(topOne?.birthday).toLocaleDateString(
                  isArabic ? "ar" : "en-US",
                  {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  },
                )}
              </span>
            </h4>
            <h4
              className="bg-gray-900 text-white px-3 py-2 text-sm rounded flex flex-col gap-2 border
                lg:grow border-gray-600"
            >
              <span className="text-gray-300">{t("TopOne.Gender")}</span>
              <span className="flex items-center gap-1 font-bold">
                {topOne?.gender === 2
                  ? ` ♂️${t("TopOne.Male")}`
                  : ` ♀️${t("TopOne.Female")}`}
              </span>
            </h4>
          </div>
          {/* latest works */}
          {/* latest works imgs*/}
          <div className="flex flex-wrap justify-between gap-4">
            <LatestWorks person={topOne} label={t("TopOne.LatestWorks")} />
            {/* view profile */}
            <Link
              href={`/details/person/${topOne?.id}/${nameToSlug(topOne?.name)}`}
              className="flex items-center gap-2 bg-blue-800 hover:bg-blue-600 lg:hover:shadow-blueGlow
                px-4 py-2 self-end rounded text-white flex-none"
            >
              <span>{t("TopOne.ViewProfile")}</span>
              <FaChevronCircleUp />
            </Link>
          </div>
        </div>

        {/* top actor image */}
        <div
          className="w-[250px] h-[375px] flex-none relative rounded-md order-first lg:order-last
            border border-gray-600"
        >
          {!isImgLoaded && <BgPlaceholder />}
          {(topOne?.profile_path || topOneProfilePath) && (
            <Image
              src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${topOneProfilePath ?? topOne?.profile_path}`}
              fill
              sizes="100%"
              alt={topOne?.name ?? ""}
              priority
              className={`rounded-md w-auto h-auto object-cover
              ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
              transition-[transform,opacity] duration-300 transform-gpu ease-out `}
              onLoad={() =>
                dispatch(
                  setImageLoaded(topOneProfilePath ?? topOne?.profile_path),
                )
              }
            />
          )}
        </div>
      </main>
    </section>
  );
};

export default TopOneCard;
