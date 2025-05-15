import { setImageLoaded } from "@/lib/Redux/localSlices/imgPlaceholderSlice";
import { openModal } from "@/lib/Redux/localSlices/videoModalSlice";
import { AppDispatch, RootState } from "@/lib/Redux/store";
import Image from "next/image";
import { memo } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  getVideoThumbnail,
  nameToSlug,
  scrollToTop,
} from "../../../../helpers/helpers";
import VideoDuration from "../VideoDuration/VideoDuration";
import BgPlaceholder from "../BgPlaceholder/BgPlaceholder";
import { Link } from "@/i18n/navigation";
import { ImPlay2 } from "@react-icons/all-files/im/ImPlay2";

interface TrailerCardProps {
  videoKey: string;
  name: string;
  showId: number;
  showType: "movie" | "tv";
}

const TrailerCard = ({
  showId,
  showType,
  name,
  videoKey,
}: TrailerCardProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const isImgLoaded = useSelector(
    (state: RootState) => state.imgPlaceholderReducer.loadedImgs?.[videoKey],
    shallowEqual,
  );

  return (
    <>
      <div
        className="cursor-pointer group overflow-hidden bg-black rounded-md p-1
          [box-shadow:0_0_3px_#1c64f2]"
        onClick={() => dispatch(openModal(videoKey))}
      >
        <div className="relative overflow-hidden" title={name} role="button">
          {!isImgLoaded && <BgPlaceholder />}
          <Image
            loading="lazy"
            src={getVideoThumbnail(videoKey)}
            alt={name + " | " + name}
            width={350}
            height={200}
            className={`rounded-md lg:group-hover:scale-105 relative z-0 w-full h-full
              ${isImgLoaded ? "opacity-100 scale-100" : "opacity-0 scale-90"}
              transition-[transform,opacity] duration-300 transform-gpu ease-out `}
            onLoad={() => dispatch(setImageLoaded(videoKey))}
          />
          {/* layer */}
          <ImPlay2
            className="text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white
              z-10"
          />
          <h6 className="absolute bottom-0 end-0 bg-black/80 py-1 px-2 z-10">
            <VideoDuration videoKey={videoKey} />
          </h6>
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/30
              group-hover:bg-black/60"
          ></div>
        </div>
        <Link
          href={`/details/${showType}/${showId}/${nameToSlug(name)}`}
          onClick={(e) => {
            e.stopPropagation();
            scrollToTop();
          }}
          className="mt-2 line-clamp-1 ps-2 hover:underline w-fit"
        >
          {name}
        </Link>
      </div>
    </>
  );
};

export default memo(TrailerCard);
