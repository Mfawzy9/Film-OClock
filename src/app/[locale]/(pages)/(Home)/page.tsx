import HomeServer from "@/app/_Components/Home/HomeComp/HomeServer";
import Error from "@/app/error";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

const HomePage = () => {
  return (
    <ErrorBoundary errorComponent={Error}>
      <HomeServer />
    </ErrorBoundary>
  );
};

export default HomePage;
