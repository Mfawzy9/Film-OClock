// import dynamic from "next/dynamic";
// import HomeSliderFetcher from "../../MainHomeSlider/HomeSliderFetcher";
import HomeClient from "./HomeClient";

// const WatchHistory = dynamic(
//   () => import("@/app/_Components/Home/WatchHistory/WatchHistory"),
// );
// const PopularPplHomeSlider = dynamic(
//   () => import("@/app/_Components/Home/PopularPplHomeSlider"),
//   {
//     loading: () => {
//       const CardsSkeletonSlider = dynamic(
//         () => import("@/app/_Components/CardsSlider/CardsSkeletonSlider"),
//       );
//       return <CardsSkeletonSlider />;
//     },
//   },
// );

const HomeServer = () => {
  return (
    <>
      {/* <HomeSliderFetcher /> */}
      {/* <WatchHistory /> */}
      {/* <PopularPplHomeSlider /> */}
      <HomeClient />
    </>
  );
};

export default HomeServer;
