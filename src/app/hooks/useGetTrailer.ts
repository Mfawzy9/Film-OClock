import { useLazyGetVideosQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { openModal } from "@/lib/Redux/localSlices/videoModalSlice";
import { AppDispatch } from "@/lib/Redux/store";
import { useDispatch } from "react-redux";

export const useGetTrailer = () => {
  const [getVideos] = useLazyGetVideosQuery();
  const dispatch = useDispatch<AppDispatch>();

  const showTrailer = async (showId: number, showType: "movie" | "tv") => {
    const { data: videoData } = await getVideos({ showId, showType }, true);

    if (videoData) {
      const trailer = videoData.results.find(
        (video) => video.type === "Trailer",
      );

      if (trailer) {
        dispatch(openModal(trailer.key));
      } else {
        alert("Trailer not found!");
      }
    }
  };

  return { showTrailer };
};
