import dynamic from "next/dynamic";
import { FaCircle } from "@react-icons/all-files/fa/FaCircle";

const HomeClient = dynamic(() => import("./HomeClient"), {
  loading: () => (
    <div className="flex items-center h-full min-h-[465px]">
      <FaCircle className="text-6xl mx-auto animate-ping text-blue-300" />
    </div>
  ),
});

const HomeClientWrapper = () => {
  return <HomeClient />;
};

export default HomeClientWrapper;
