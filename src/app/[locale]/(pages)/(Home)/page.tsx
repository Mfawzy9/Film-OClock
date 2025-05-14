import HomeComp from "@/app/_Components/HomeComp/HomeComp";
import Error from "@/app/error";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

const HomePage = () => {
  return (
    <ErrorBoundary errorComponent={Error}>
      <HomeComp />
    </ErrorBoundary>
  );
};

export default HomePage;
