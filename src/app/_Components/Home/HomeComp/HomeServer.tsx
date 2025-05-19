import dynamic from "next/dynamic";
import HomeSliderFetcher from "../../MainHomeSlider/HomeSliderFetcher";
import { FaCircle } from "@react-icons/all-files/fa/FaCircle";

const WatchHistory = dynamic(
  () => import("@/app/_Components/Home/WatchHistory/WatchHistory"),
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
const HomeClientWrapper = dynamic(() => import("./HomeClientWrapper"), {
  loading: () => (
    <div className="flex items-center h-full min-h-[465px]">
      <FaCircle className="text-6xl mx-auto animate-ping text-blue-300" />
    </div>
  ),
});

const HomeServer = () => {
  return (
    <>
      <HomeSliderFetcher />
      <WatchHistory />
      <PopularPplHomeSlider />
      <HomeClientWrapper />
    </>
  );
};

export default HomeServer;
