"use client";
import {
  DetailsQueryParams,
  PersonDetailsResponse,
  PImages,
} from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import { useGetMTDetailsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import Image from "next/image";
import { calculateAge, nameToSlug } from "../../../../helpers/helpers";
import { useRef, useState, useMemo, useEffect } from "react";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import Tabs from "../Tabs/Tabs";
import dynamic from "next/dynamic";
import Title from "../Title/Title";
import SocialLinks from "../SocialLinks/SocialLinks";
import PageSection from "../PageSection/PageSection";
import LatestWorks from "../LatestWorks/LatestWorks";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { useTranslations } from "next-intl";
import useIsArabic from "@/app/hooks/useIsArabic";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import LazyRender from "../LazyRender/LazyRender";
import { useRouter } from "@/i18n/navigation";
import { FaAngleDown } from "@react-icons/all-files/fa/FaAngleDown";
import { FaBirthdayCake } from "@react-icons/all-files/fa/FaBirthdayCake";
import { FaExternalLinkAlt } from "@react-icons/all-files/fa/FaExternalLinkAlt";
import { FaFilm } from "@react-icons/all-files/fa/FaFilm";
import { FaImages } from "@react-icons/all-files/fa/FaImages";
import { FaTransgenderAlt } from "@react-icons/all-files/fa/FaTransgenderAlt";
import { GiTombstone } from "@react-icons/all-files/gi/GiTombstone";
import { GiTv } from "@react-icons/all-files/gi/GiTv";
import { IoMdListBox } from "@react-icons/all-files/io/IoMdListBox";
import { IoLocationSharp } from "@react-icons/all-files/io5/IoLocationSharp";
import { MdRecentActors } from "@react-icons/all-files/md/MdRecentActors";

const PersonDetailsSkeleton = dynamic(() => import("./PersonDetailsSkeleton"));
const CardsSkeletonSlider = dynamic(
  () => import("../CardsSlider/CardsSkeletonSlider"),
);
const CardsSlider = dynamic(() => import("../CardsSlider/CardsSlider"), {
  loading: () => <CardsSkeletonSlider />,
});
const PersonImgsSlider = dynamic(() => import("./PersonImgsSlider"));

interface props extends DetailsQueryParams {
  slug: string;
  locale: "en" | "ar";
}

const PersonDetails = ({ showId, showType, slug, locale }: props) => {
  const { isArabic } = useIsArabic();
  const t = useTranslations("PersonDetails");
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { data: details, isLoading } = useGetMTDetailsQuery({
    showId,
    showType,
    lang: isArabic ? "ar" : "en",
  }) as {
    data: PersonDetailsResponse | null;
    isLoading: boolean;
  };

  useEffect(() => {
    if (!details) return;

    const correctSlug = nameToSlug(details.name);
    const decodedSlug = decodeURIComponent(slug);

    if (decodedSlug !== correctSlug) {
      router.replace(`/details/${showType}/${showId}/${correctSlug}`);
    }
  }, [details, slug, locale, showType, showId, router]);

  const [showMore, setShowMore] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [maxHeight, setMaxHeight] = useState("173px");

  const handleToggle = () => {
    if (contentRef.current)
      setMaxHeight(showMore ? "173px" : `${contentRef.current.scrollHeight}px`);
    setShowMore(!showMore);
  };

  const [needsExpandButton, setNeedsExpandButton] = useState(false);

  const isActing = details?.known_for_department === "Acting";

  useEffect(() => {
    if (contentRef.current && details?.biography) {
      setNeedsExpandButton(contentRef.current.scrollHeight > 173);
    }
  }, [details?.biography]); // Re-run when biography changes

  const tabs = useMemo(
    () => [
      {
        name: t("Tabs.Movies"),
        icon: <FaFilm />,
        content: (
          <>
            {isActing && details?.movie_credits?.cast?.length === 0 && (
              <p className="text-center text-2xl font-bold">
                {t("NoResultsFound")}
              </p>
            )}
            {!isActing && details?.movie_credits?.crew?.length === 0 && (
              <p className="text-center text-2xl font-bold">
                {t("NoResultsFound")}
              </p>
            )}

            <LazyRender
              Component={CardsSlider}
              props={{
                showType: "movie",
                theShows: isActing
                  ? (details?.movie_credits?.cast as Movie[])
                  : (details?.movie_credits?.crew as Movie[]),
                sliderType: "movies",
                title: isArabic
                  ? `${t("Tabs.Movies")} ${details?.name}`
                  : `${details?.name} ${t("Tabs.Movies")}`,
                isLoading: isLoading,
              }}
              loading={<CardsSkeletonSlider />}
              persistKey={`person-movies-${showId}`}
            />
          </>
        ),
      },
      {
        name: t("Tabs.TvShowsTabTitle"),
        icon: <GiTv />,
        content: (
          <>
            {isActing && details?.tv_credits?.cast?.length === 0 && (
              <p className="text-center text-2xl font-bold">
                {t("NoResultsFound")}
              </p>
            )}
            {!isActing && details?.tv_credits?.crew?.length === 0 && (
              <p className="text-center text-2xl font-bold">
                {t("NoResultsFound")}
              </p>
            )}

            <LazyRender
              Component={CardsSlider}
              props={{
                showType: "tv",
                theShows: isActing
                  ? (details?.tv_credits?.cast as TVShow[])
                  : (details?.tv_credits?.crew as TVShow[]),
                sliderType: "tvShows",
                title: isArabic
                  ? `${t("Tabs.TvShowsTabTitle")} ${details?.name}`
                  : `${details?.name} ${t("Tabs.TvShowsTabTitle")}`,
                isLoading: isLoading,
              }}
              loading={<CardsSkeletonSlider />}
              persistKey={`person-tvShows-${showId}`}
            />
          </>
        ),
      },
      {
        name: t("Tabs.Photos"),
        icon: <FaImages />,
        content: (
          <PersonImgsSlider
            images={(details?.images as PImages) || []}
            name={details?.name || details?.also_known_as?.[0] || ""}
          />
        ),
      },
    ],
    [details, isActing, isArabic, t, isLoading, showId],
  );
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const isImgLoaded = useSelector(
    (state: RootState) =>
      state.imgPlaceholderReducer.loadedImgs?.[details?.profile_path ?? ""] ||
      false,
  );

  if (isLoading || !details) return <PersonDetailsSkeleton />;

  return (
    details && (
      <>
        <PageSection>
          <main className="flex gap-12 flex-col md:flex-row items-center md:items-start">
            <div className="flex flex-col items-center gap-4">
              {/* Poster */}
              <div className="w-[250px] h-[375px] flex-none relative">
                {!isImgLoaded && <BgPlaceholder />}
                {details?.profile_path ? (
                  <Image
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    src={`${process.env.NEXT_PUBLIC_BASE_IMG_URL_W500}${details?.profile_path}`}
                    alt={details?.name}
                    className={`rounded-md ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
                      transition-[transform,opacity] duration-300 transform-gpu ease-out`}
                    priority
                    onLoad={() => {
                      dispatch(setImageLoaded(details?.profile_path ?? ""));
                    }}
                  />
                ) : (
                  <>
                    <h3 className="relative z-30 flex items-center justify-center gap-1 text-center h-full text-xl">
                      {details?.name}{" "}
                    </h3>
                    <BgPlaceholder />
                  </>
                )}
              </div>
              {/* Social Links */}
              {details?.external_ids && (
                <SocialLinks externalIds={details?.external_ids} isPerson />
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <Title title={details?.name || details?.also_known_as?.[0]} />
                {details?.homepage && (
                  <a
                    href={details?.homepage}
                    target="_blank"
                    className="hover:text-blue-700 mb-3"
                    rel="noopener noreferrer"
                  >
                    <FaExternalLinkAlt
                      title="Home page"
                      className="text-base"
                    />
                  </a>
                )}
              </div>

              {/*  Info */}
              <div className="flex flex-col gap-2">
                {details?.gender !== 0 && details?.gender !== 3 && (
                  <h4 className="flex items-center gap-1 flex-wrap font-light">
                    <FaTransgenderAlt />
                    <span className="font-bold text-blue-300">
                      {t("Gender")} :
                    </span>
                    {details?.gender === 1 ? t("Female") : t("Male")}
                  </h4>
                )}
                <h4 className="flex items-center gap-1 flex-wrap font-light">
                  <FaBirthdayCake />
                  <span className="font-bold text-blue-300">
                    {t("Birthday")} :
                  </span>
                  {calculateAge(details?.birthday, isArabic)}
                </h4>
                {details?.deathday && (
                  <h4 className="flex items-center gap-1 flex-wrap font-light">
                    <GiTombstone />
                    <span className="font-bold text-blue-300">
                      {t("Deathday")} :
                    </span>
                    {details?.deathday?.replace(/-/g, "/")}
                  </h4>
                )}
                {details?.place_of_birth && (
                  <h4 className="flex items-center gap-1 flex-wrap font-light">
                    <IoLocationSharp />
                    <span className="font-bold text-blue-300">
                      {t("PlaceOfBirth")} :
                    </span>
                    {details?.place_of_birth}
                  </h4>
                )}
                <h4 className="flex items-center gap-1 flex-wrap font-light">
                  <MdRecentActors />
                  <span className="font-bold text-blue-300">
                    {t("KnownFor")} :
                  </span>
                  {details?.known_for_department === "Acting"
                    ? t("Acting")
                    : details?.known_for_department === "Directing"
                      ? t("Directing")
                      : details?.known_for_department === "Production"
                        ? t("Producing")
                        : details?.known_for_department}
                </h4>

                {/* latest works */}
                {details?.combined_credits &&
                  (details?.combined_credits.cast.length !== 0 ||
                    details?.combined_credits.crew.length !== 0) && (
                    <LatestWorks person={details} label={t("RecentWorks")} />
                  )}

                {/* Biography */}
                {details?.biography && (
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="font-bold text-blue-300 me-1 flex items-center gap-1">
                      <IoMdListBox className="text-white" />
                      {t("Biography")} :
                    </span>
                    <p
                      ref={contentRef}
                      className="tracking-wide leading-loose text-gray-200 text-sm transition-all duration-700
                        ease-in-out overflow-hidden break-normal"
                      style={{ maxHeight }}
                    >
                      {details?.biography}
                    </p>
                    {needsExpandButton && (
                      <button
                        onClick={handleToggle}
                        className="text-blue-600 flex items-center gap-1 hover:text-blue-300 transition-all
                          duration-200 font-roboto"
                      >
                        {showMore ? t("ShowLess") : t("ViewFullBiography")}
                        <FaAngleDown
                          className={`text-xl ${showMore ? "rotate-180" : "rotate-0"} transition-transform
                          duration-200`}
                        />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </main>
        </PageSection>
        <PageSection>
          {/* tabs */}

          <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
        </PageSection>
      </>
    )
  );
};

export default PersonDetails;
