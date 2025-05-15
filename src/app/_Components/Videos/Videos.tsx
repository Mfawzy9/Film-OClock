import { VideosResponse } from "@/app/interfaces/apiInterfaces/videosInterfaces";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import { memo, useCallback, useMemo, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import SelectComp from "../SelectComp/SelectComp";
import { useTranslations } from "next-intl";
import VideoCard from "./VideoCard";

interface VideosProps {
  videos: VideosResponse;
  name: string;
}

const VIDEOS_PER_CLICK = 4;

const Videos = ({ videos, name }: VideosProps) => {
  const t = useTranslations("VideosSelect");
  const dispatch = useDispatch<AppDispatch>();
  const [visableVideos, setVisableVideos] = useState(VIDEOS_PER_CLICK);

  const loadMoreVideos = useCallback(() => {
    setVisableVideos((prev) => prev + VIDEOS_PER_CLICK);
  }, []);

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

  const canLoadMore = useMemo(() => {
    return activeVideos?.length > visableVideos;
  }, [activeVideos, visableVideos]);

  return videos?.results.length === 0 || !videos ? (
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
        {activeVideos?.slice(0, visableVideos).map((video) => {
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
      {canLoadMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMoreVideos}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            {t("LoadMore")}
          </button>
        </div>
      )}
    </>
  );
};

export default memo(Videos);
