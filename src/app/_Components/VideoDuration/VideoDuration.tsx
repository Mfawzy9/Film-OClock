"use client";
import { useGetYoutubeDurationQuery } from "@/lib/Redux/apiSlices/videoDurationSlice";

const VideoDuration = ({ videoKey }: { videoKey: string }) => {
  const { data: duration, isLoading } = useGetYoutubeDurationQuery(videoKey);

  return <>{duration && <span>{isLoading ? "Loading..." : duration}</span>}</>;
};

export default VideoDuration;
