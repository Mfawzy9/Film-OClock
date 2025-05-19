import dynamic from "next/dynamic";
import LazyRender from "../../LazyRender/LazyRender";
import ShortDetailsSkeleton from "../../ShortDetails/ShortDetailsSkeleton";

const LastWatched = dynamic(
  () => import("@/app/_Components/Home/WatchHistory/LastWatched"),
);
const LazyLastWatched = () => {
  return (
    <LazyRender
      Component={LastWatched}
      loading={<ShortDetailsSkeleton className="!py-0 mt-14" />}
    />
  );
};

export default LazyLastWatched;
