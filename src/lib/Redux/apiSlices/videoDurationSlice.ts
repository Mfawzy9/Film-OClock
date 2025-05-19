import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { parseYouTubeDuration } from "../../../../helpers/helpers";

const videoDurationSlice = createApi({
  reducerPath: "videoDurationApi",
  refetchOnReconnect: true,
  baseQuery: fakeBaseQuery(),
  tagTypes: ["VideoDuration"],
  endpoints: (builder) => ({
    // !Get video duration
    getYoutubeDuration: builder.query({
      // `string` is the videoKey
      async queryFn(videoKey: string) {
        const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoKey}&part=contentDetails&key=${API_KEY}`;

        try {
          const response = await fetch(url);
          const data = await response.json();

          if (data.items.length > 0) {
            const durationISO = data.items[0].contentDetails.duration;
            const durationInSeconds = parseYouTubeDuration(durationISO);
            return { data: durationInSeconds };
          } else {
            return { data: null };
          }
        } catch (error) {
          return {
            error: { status: "CUSTOM_ERROR", error: (error as Error).message },
          };
        }
      },
      providesTags: ["VideoDuration"],
    }),
  }),
});

export const { useGetYoutubeDurationQuery } = videoDurationSlice;

export default videoDurationSlice;
