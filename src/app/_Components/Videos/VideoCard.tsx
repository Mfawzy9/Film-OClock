import Image from "next/image";
import VideoDuration from "../VideoDuration/VideoDuration";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { openModal } from "@/lib/Redux/localSlices/videoModalSlice";
import { memo } from "react";
import { getVideoThumbnail } from "../../../../helpers/helpers";
import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import { AppDispatch } from "@/lib/Redux/store";
import { VideosResults } from "@/app/interfaces/apiInterfaces/videosInterfaces";
import { ImPlay2 } from "@react-icons/all-files/im/ImPlay2";

const VideoCard = ({
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
          className={`rounded-md lg:group-hover:scale-105 relative z-0
            ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
            transition-[transform,opacity] duration-300 transform-gpu ease-out `}
          onLoad={() => dispatch(setImageLoaded(video.key))}
        />

        {/* layer */}
        <ImPlay2
          className="text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white
            z-10"
        />
        <h6 className="absolute bottom-0 right-0 bg-black/80 py-1 px-2 z-10">
          <VideoDuration videoKey={video.key} />
        </h6>
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/30
            group-hover:bg-black/60"
        ></div>
      </div>
      <p className="text-sm mt-2 line-clamp-1 ps-2">{video.name}</p>
      <span className="text-xs text-gray-400 ps-2">{video.type}</span>
    </div>
  );
};

export default memo(VideoCard);
