import {
  VideosResponse,
  VideosResults,
} from "@/app/interfaces/apiInterfaces/videosInterfaces";
import { getVideoThumbnail } from "../../../../helpers/helpers";
import { openModal } from "@/lib/Redux/localSlices/videoModalSlice";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import Image from "next/image";
import { memo, useMemo, useState } from "react";
import { FaRegCirclePlay } from "react-icons/fa6";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import VideoDuration from "../VideoDuration/VideoDuration";
import SelectComp from "../SelectComp/SelectComp";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import { useTranslations } from "next-intl";

const VideoCard = memo(
  ({
    video,
    name,
    isImgLoaded,
    dispatch,
  }: {
    video: VideosResults;
    name: string;
    isImgLoaded: boolean;
    dispatch: AppDispatch;
  }) => {
    return (
      <div
        key={video.id}
        className="cursor-pointer group overflow-hidden bg-black rounded-md p-1
          [box-shadow:0_0_3px_#1c64f2]"
        onClick={() => dispatch(openModal(video.key))}
      >
        <div
          className="relative overflow-hidden"
          title={video.name}
          role="button"
        >
          {!isImgLoaded && <BgPlaceholder />}

          <Image
            loading="lazy"
            src={getVideoThumbnail(video.key)}
            alt={video.name + " | " + name}
            width={600}
            height={400}
            className={`rounded-md group-hover:scale-105 relative z-0
              ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
              transition-[transform,opacity] duration-300 transform-gpu ease-out `}
            onLoad={() => dispatch(setImageLoaded(video.key))}
          />

          {/* layer */}
          <FaRegCirclePlay
            className="text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white
              z-10"
          />
          <h6 className="absolute bottom-0 right-0 bg-black/80 py-1 px-2 z-10">
            <VideoDuration videoKey={video.key} />
          </h6>
          <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black/50"></div>
        </div>
        <p className="text-sm mt-2 line-clamp-1 ps-2">{video.name}</p>
        <span className="text-xs text-gray-400 ps-2">{video.type}</span>
      </div>
    );
  },
);

VideoCard.displayName = "VideoCard";

interface VideosProps {
  videos: VideosResponse;
  name: string;
}

const Videos = ({ videos, name }: VideosProps) => {
  const t = useTranslations("VideosSelect");
  const dispatch = useDispatch<AppDispatch>();

  const loadedImgs = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs,
    shallowEqual,
  );

  const nameQuery =
    videos?.results?.find((video) => video.type === "Trailer")?.type ||
    t("AllVideos");
  const [activeSelect, setActiveSelect] = useState({
    query: nameQuery,
    name: nameQuery,
  });

  const videoTypes = useMemo(() => {
    const types = [...new Set(videos?.results?.map((video) => video?.type))];
    return [
      { query: t("AllVideos"), name: t("AllVideos") },
      ...types.map((type) => ({ query: type, name: type })),
    ];
  }, [videos, t]);

  const activeVideos = useMemo(() => {
    if (activeSelect.query === t("AllVideos")) {
      return videos?.results;
    } else {
      return videos?.results.filter(
        (video) => video?.type === activeSelect.query,
      );
    }
  }, [activeSelect, videos?.results, t]);

  return (
    <>
      {videos?.results.length === 0 || !videos ? (
        <p className="text-center text-2xl font-bold">{t("NoVideosFound")}</p>
      ) : (
        <>
          {/* filter select */}
          <SelectComp
            items={videoTypes}
            activeSelect={activeSelect}
            setActiveSelect={setActiveSelect}
            label={t("VideosSelectTitle")}
          />

          {/* videos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
            {activeVideos?.map((video) => {
              const isImgLoaded = loadedImgs[video?.key];
              return (
                <VideoCard
                  key={video.id}
                  video={video}
                  name={name}
                  isImgLoaded={isImgLoaded}
                  dispatch={dispatch}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

export default memo(Videos);
