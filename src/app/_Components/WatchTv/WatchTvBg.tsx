import fallbackBg from "../../../../public/images/fallback-bg.jpg";
import Image from "next/image";

interface WatchTvBgProps {
  backdropPath?: string;
}

const WatchTvBg = ({ backdropPath }: WatchTvBgProps) => {
  return (
    <div className="min-h-screen absolute w-full -z-10">
      <Image
        src={
          backdropPath
            ? `${process.env.NEXT_PUBLIC_BASE_IMG_URL_W1280}${backdropPath}`
            : fallbackBg.src
        }
        alt={"background"}
        fill
        priority
        className="object-cover object-top"
      />
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/70 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent" />
      <div className="absolute inset-0 bg-black/80" />
    </div>
  );
};

export default WatchTvBg;
