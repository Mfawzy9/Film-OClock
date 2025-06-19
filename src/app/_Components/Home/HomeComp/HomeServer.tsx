import dynamic from "next/dynamic";
import HomeSliderFetcher from "../../MainHomeSlider/HomeSliderFetcher";
import HomeClient from "./HomeClient";
import PopularPplHomeSlider from "../PopularPplHomeSlider";

const WatchHistory = dynamic(
  () => import("@/app/_Components/Home/WatchHistory/WatchHistory"),
);

const HomeServer = () => {
  return (
    <>
      <HomeSliderFetcher />
      <WatchHistory />
      <PopularPplHomeSlider />
      <HomeClient />
    </>
  );
};

export default HomeServer;
