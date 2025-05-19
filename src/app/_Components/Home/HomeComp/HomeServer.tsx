import dynamic from "next/dynamic";
import HomeSliderFetcher from "../../MainHomeSlider/HomeSliderFetcher";
import { Suspense } from "react";
import HomeClient from "./HomeClient";

const WatchHistory = dynamic(
  () => import("@/app/_Components/Home/WatchHistory/WatchHistory"),
);
const HomeSliderSkeleton = dynamic(
  () => import("@/app/_Components/MainHomeSlider/HomeSliderSkeleton"),
);
const PopularPplHomeSlider = dynamic(
  () => import("@/app/_Components/Home/PopularPplHomeSlider"),
  {
    loading: () => {
      const CardsSkeletonSlider = dynamic(
        () => import("@/app/_Components/CardsSlider/CardsSkeletonSlider"),
      );
      return <CardsSkeletonSlider />;
    },
  },
);

const HomeServer = () => {
  return (
    <>
      <Suspense fallback={<HomeSliderSkeleton />}>
        <HomeSliderFetcher />
      </Suspense>
      {/* watch history */}
      <WatchHistory />
      {/* popular people */}
      <PopularPplHomeSlider />
      <HomeClient />
    </>
  );
};

export default HomeServer;
