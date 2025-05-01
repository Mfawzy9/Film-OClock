// src/lib/Redux/apiSlices/translationApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface TranslationResult {
  translatedTitle?: string;
  translatedOverview: string;
  translatedGenres?: string[];
  originalOverview: string;
  originalTitle?: string;
}

interface MYMEMORYApiResponse {
  responseData?: {
    translatedText: string;
  };
}

interface GoogleTranslationResponse {
  data?: {
    translations?: Array<{
      translatedText?: string;
    }>;
  };
}

const myMemoryApiKey = process.env.NEXT_PUBLIC_MYMEMORY_API_KEY;

export const translationApi = createApi({
  reducerPath: "translationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api", // all secure calls will go through your API routes
  }),
  tagTypes: ["Translation"],
  endpoints: (builder) => ({
    // ------------------- MYMEMORY TRANSLATION -------------------
    translateWithMYMEMORY: builder.query<
      TranslationResult,
      { overview: string; genres?: string[]; title?: string }
    >({
      query: ({ overview, genres = [], title }) => {
        const parts: string[] = [];
        if (title) parts.push(title);
        if (genres.length) parts.push(genres.join("||"));
        parts.push(overview);

        const textToTranslate = parts.join("||||");

        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          textToTranslate,
        )}&langpair=en|ar${myMemoryApiKey ? `&key=${myMemoryApiKey}` : ""}`;

        return {
          url,
          method: "GET",
        };
      },
      transformResponse: (
        response: MYMEMORYApiResponse,
        meta,
        { overview, genres, title },
      ): TranslationResult => {
        if (!response?.responseData?.translatedText) {
          return {
            translatedOverview: overview,
            translatedGenres: genres,
            translatedTitle: title,
            originalOverview: overview,
            originalTitle: title,
          };
        }

        const translatedParts =
          response.responseData.translatedText.split("||||");

        let translatedTitle: string | undefined;
        let translatedGenresResult: string[] | undefined;
        let translatedOverviewResult: string;

        if (title && genres?.length) {
          translatedTitle = translatedParts[0];
          translatedGenresResult = translatedParts[1]?.split("||");
          translatedOverviewResult = translatedParts[2] || overview;
        } else if (title) {
          translatedTitle = translatedParts[0];
          translatedOverviewResult = translatedParts[1] || overview;
        } else if (genres?.length) {
          translatedGenresResult = translatedParts[0]?.split("||");
          translatedOverviewResult = translatedParts[1] || overview;
        } else {
          translatedOverviewResult = translatedParts[0] || overview;
        }

        return {
          translatedTitle: translatedTitle || title,
          translatedGenres: translatedGenresResult || genres,
          translatedOverview: translatedOverviewResult,
          originalOverview: overview,
          originalTitle: title,
        };
      },
      providesTags: (result, error, arg) => [
        {
          type: "Translation",
          id: `overview-${arg.overview.substring(0, 30)}`,
        },
        ...(arg.genres?.map((g) => ({
          type: "Translation" as const,
          id: `genre-${g}`,
        })) || []),
        ...(arg.title
          ? [
              {
                type: "Translation" as const,
                id: `title-${arg.title.substring(0, 20)}`,
              },
            ]
          : []),
      ],
      keepUnusedDataFor: 86400, // 1 day
    }),

    // ------------------- GOOGLE TRANSLATE (SAFE THROUGH SERVER) -------------------
    translateWithGoogle: builder.mutation<
      TranslationResult,
      {
        overview: string;
        title?: string;
        from?: string;
        to?: string;
      }
    >({
      query: ({ overview, title, from = "en", to = "ar" }) => {
        const parts: string[] = [];
        if (title) parts.push(title);
        parts.push(overview);

        const combinedText = parts.join("||||");

        return {
          url: "translate", // calling /api/translate
          method: "POST",
          body: {
            q: combinedText,
            from,
            to,
          },
        };
      },
      transformResponse: (
        response: GoogleTranslationResponse,
        meta,
        { overview, title },
      ): TranslationResult => {
        const fullTranslated =
          response?.data?.translations?.[0]?.translatedText || "";
        const translatedParts = fullTranslated.split("||||");

        let translatedTitle: string | undefined;
        let translatedOverviewResult: string;

        if (title) {
          translatedTitle = translatedParts[0];
          translatedOverviewResult = translatedParts[1] || overview;
        } else {
          translatedOverviewResult = translatedParts[0] || overview;
        }

        return {
          translatedTitle: translatedTitle || title,
          translatedOverview: translatedOverviewResult,
          originalOverview: overview,
          originalTitle: title,
        };
      },
      invalidatesTags: (result, error, arg) => [
        {
          type: "Translation",
          id: `overview-${arg.overview.substring(0, 30)}`,
        },
        ...(arg.title
          ? [
              {
                type: "Translation" as const,
                id: `title-${arg.title.substring(0, 20)}`,
              },
            ]
          : []),
      ],
    }),
  }),
});

export const {
  useTranslateWithMYMEMORYQuery,
  useLazyTranslateWithMYMEMORYQuery,
  useTranslateWithGoogleMutation,
} = translationApi;

export default translationApi;
