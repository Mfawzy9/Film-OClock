import {
  MoviesResponse,
  DiscoverQueryParams,
  TVShowsResponse,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { mainApiSlice } from "../tmdbBaseQuery";
import {
  VideosQueryParams,
  VideosResponse,
} from "@/app/interfaces/apiInterfaces/videosInterfaces";
import {
  GenresQueryParams,
  GenresResponse,
} from "@/app/interfaces/apiInterfaces/genresInterfaces";

import {
  AllTrendsResponse,
  MoviesTrendsResponse,
  PplTrendsResponse,
  TrendsQueryParams,
  TVShowsTrendsResponse,
} from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import {
  DetailsQueryParams,
  MovieDetailsResponse,
  PersonDetailsResponse,
  TvDetailsResponse,
} from "@/app/interfaces/apiInterfaces/detailsInterfaces";
import {
  CreditsQueryParams,
  MovieCreditsResponse,
  TvCreditsResponse,
} from "@/app/interfaces/apiInterfaces/creditsInterfaces";
import {
  ImagesQueryparams,
  MovieImagesResponse,
  PersonImagesResponse,
  TvImagesResponse,
} from "@/app/interfaces/apiInterfaces/imagesInterfaces";
import {
  MovieReviewsResponse,
  ReviewsQueryParams,
  TvReviewsResponse,
} from "@/app/interfaces/apiInterfaces/reviewsInterfaces";
import {
  MovieRecommendationsResponse,
  RecommendationsQueryParams,
  TvRecommendationsResponse,
} from "@/app/interfaces/apiInterfaces/recommendationsInterfaces";
import {
  MovieSimilarsResponse,
  SimilarsQueryParams,
  TvShowSimilarsResponse,
} from "@/app/interfaces/apiInterfaces/similarInterfaces";
import {
  TvSeasonDetailsQueryParams,
  TvSeasonDetailsResponse,
} from "@/app/interfaces/apiInterfaces/tvSeasonsDetailsInterfaces";
import {
  SearchMultiMovieTvResponse,
  SearchMultiPersonResponse,
  SearchQueryParams,
} from "@/app/interfaces/apiInterfaces/SearchMultiInterfaces";
import {
  SearchMovieQueryParams,
  SearchMovieResponse,
} from "@/app/interfaces/apiInterfaces/searchMovieInterfaces";
import {
  SearchTvShowQueryParams,
  SearchTvShowResponse,
} from "@/app/interfaces/apiInterfaces/SearchTvshowInterfaces";
import {
  SearchPersonQueryParams,
  SearchPersonResponse,
} from "@/app/interfaces/apiInterfaces/searchPersonInterfaces";
import {
  NowPlayingMoviesQueryParams,
  NowPlayingMoviesResponse,
} from "@/app/interfaces/apiInterfaces/nowPlayingMoviesInterfaces";
import {
  PopularMoviesResponse,
  PopularQueryParams,
  PopularPersonResponse,
  PopularTvShowResponse,
} from "@/app/interfaces/apiInterfaces/popularMoviesTvInterfaces";
import {
  TopRatedMoviesResponse,
  TopRatedMoviesTvQueryParams,
  TopRatedTvShowResponse,
} from "@/app/interfaces/apiInterfaces/topRatedInterfaces";
import {
  UpcomingMoviesQueryParams,
  UpcomingMoviesResponse,
} from "@/app/interfaces/apiInterfaces/upcomingMoviesInterfaces";
import {
  AiringTodayQueryParams,
  AiringTodayResponse,
} from "@/app/interfaces/apiInterfaces/airingTodayInterfaces";
import {
  OnTheAirQueryParams,
  OnTheAirResponse,
} from "@/app/interfaces/apiInterfaces/onTheAirInterfaces";
import {
  MovieTranslationsResponse,
  TvTranslationsResponse,
} from "@/app/interfaces/apiInterfaces/translationsInterfaces";
import {
  EpisodeTranslationQueryParams,
  EpisodeTranslationsResponse,
} from "@/app/interfaces/apiInterfaces/episodeTranslationsInterfaces";
import {
  MovieCollectionQueryParams,
  MovieCollectionResponse,
} from "@/app/interfaces/apiInterfaces/movieCollectionInterfaces";
import { MovieCollectionTranslationsResponse } from "@/app/interfaces/apiInterfaces/movieCollectionTranslationsInterfaces";

const tmdbApi = mainApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    //! discover movies and tvShows
    getMoviesTvShows: builder.query<
      MoviesResponse | TVShowsResponse,
      DiscoverQueryParams
    >({
      query: ({
        page = 1,
        lang = "en",
        showType = "movie",
        sortBy = "popularity.desc",
        genreNum = [],
        year = "",
        ori_lang = "",
        rating = "",
      }) => ({
        url: `?path=discover/${showType}&language=${lang}&page=${page}&sort_by=${sortBy}&with_genres=${genreNum}&${showType === "movie" ? "primary_release_year" : "first_air_date_year"}=${year}&with_original_language=${ori_lang}&vote_average.gte=${rating}`,
        method: "GET",
      }),
      providesTags: (result, error, { showType }) => [
        { type: showType === "movie" ? "Movies" : "TVShows" },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    //! get translations
    getTranslations: builder.query<
      MovieTranslationsResponse | TvTranslationsResponse,
      { showType: "movie" | "tv" | "person"; showId: number }
    >({
      query: ({ showType, showId }) => ({
        url: `?path=${showType}/${showId}/translations`,
        method: "GET",
      }),
      providesTags: (result, error, { showType, showId }) => [
        {
          type: showType === "movie" ? "MovieTranslations" : "TvTranslations",
          id: showId,
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // !Episode Translations
    getEpisodeTranslations: builder.query<
      EpisodeTranslationsResponse,
      EpisodeTranslationQueryParams
    >({
      query: ({ showId, sNumber, eNumber }) => ({
        url: `?path=tv/${showId}/season/${sNumber}/episode/${eNumber}/translations`,
        method: "GET",
      }),
      providesTags: (result, error, { episodeId }) =>
        result ? [{ type: "EpisodeTranslations", id: episodeId }] : [],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // ! videos
    getVideos: builder.query<VideosResponse, VideosQueryParams>({
      query: ({ showId, showType, lang = "en" }) => ({
        url: `?path=${showType}/${showId}/videos&language=${lang}`,
        method: "GET",
      }),
      providesTags: (result, error, { showId, showType }) => [
        {
          type: showType === "movie" ? "MovieVideos" : "TVShowVideos",
          id: showId,
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // ! all trends
    getTrends: builder.query<
      | AllTrendsResponse
      | MoviesTrendsResponse
      | TVShowsTrendsResponse
      | PplTrendsResponse,
      TrendsQueryParams
    >({
      query: ({ showType, dayOrWeek = "day", page = 1, lang = "en" }) => ({
        url: `?path=trending/${showType}/${dayOrWeek}&language=${lang}&page=${page}`,
        method: "GET",
      }),
      providesTags: (result, error, { showType }) => [
        {
          type:
            showType === "all"
              ? "AllTrends"
              : showType === "movie"
                ? "MoviesTrends"
                : showType === "tv"
                  ? "TVShowsTrends"
                  : "PeopleTrends",
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    //!  genres
    getGenres: builder.query<GenresResponse, GenresQueryParams>({
      query: ({ showType, lang = "en" }) => ({
        url: `?path=genre/${showType}/list&language=${lang}`,
        method: "GET",
      }),
      providesTags: ["TVShowsGenres"],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // !movie and tv details
    getMTDetails: builder.query<
      MovieDetailsResponse | TvDetailsResponse | PersonDetailsResponse,
      DetailsQueryParams
    >({
      query: ({ showId, showType, lang = "en" }: DetailsQueryParams) => ({
        url: `?path=${showType}/${showId}&append_to_response=videos,images,external_ids,credits,recommendations,reviews,similar,combined_credits,movie_credits,tv_credits&language=${lang}`,
        method: "GET",
      }),
      providesTags: (result, err, { showId, showType }) => [
        {
          type: showType === "movie" ? "MovieDetails" : "TvShowDetails",
          id: showId,
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // ! credits
    getCredits: builder.query<
      MovieCreditsResponse | TvCreditsResponse,
      CreditsQueryParams
    >({
      query: ({ showId, showType, lang = "en" }: CreditsQueryParams) => ({
        url: `?path=${showType}/${showId}/credits&language=${lang}`,
        method: "GET",
      }),
      providesTags: (result, error, { showId, showType }) => [
        {
          type: showType === "movie" ? "MovieCredits" : "TvShowCredits",
          id: showId,
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // ! images
    getImages: builder.query<
      MovieImagesResponse | TvImagesResponse | PersonImagesResponse,
      ImagesQueryparams
    >({
      query: ({ showId, showType }: ImagesQueryparams) => ({
        url: `?path=${showType}/${showId}/images`,
        method: "GET",
      }),
      providesTags: (result, error, { showId, showType }) => [
        {
          type:
            showType === "movie"
              ? "MovieImages"
              : showType === "tv"
                ? "TvShowImages"
                : "PersonImages",
          id: showId,
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // ! Reviwes
    getReviews: builder.query<
      MovieReviewsResponse | TvReviewsResponse,
      ReviewsQueryParams
    >({
      query: ({ showId, showType, lang = "en" }: ReviewsQueryParams) => ({
        url: `?path=${showType}/${showId}/reviews&language=${lang}`,
        method: "GET",
      }),
      providesTags: (result, error, { showId, showType }) => [
        {
          type: showType === "movie" ? "MovieReviews" : "TvShowReviews",
          id: showId,
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // ! recommendations
    getRecommendations: builder.query<
      MovieRecommendationsResponse | TvRecommendationsResponse,
      RecommendationsQueryParams
    >({
      query: ({
        showId,
        showType,
        lang = "en",
      }: RecommendationsQueryParams) => ({
        url: `?path=${showType}/${showId}/recommendations&language=${lang}`,
        method: "GET",
      }),
      providesTags: (result, error, { showId, showType }) => [
        {
          type:
            showType === "movie"
              ? "MovieRecommendations"
              : "TvShowRecommendations",
          id: showId,
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // ! similar
    getSimilar: builder.query<
      MovieSimilarsResponse | TvShowSimilarsResponse,
      SimilarsQueryParams
    >({
      query: ({ showId, showType, lang = "en" }: SimilarsQueryParams) => ({
        url: `?path=${showType}/${showId}/similar&language=${lang}`,
        method: "GET",
      }),
      providesTags: (result, error, { showId, showType }) => [
        {
          type: showType === "movie" ? "MovieSimilars" : "TvShowSimilars",
          id: showId,
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // !Person Details
    getPersonDetails: builder.query<
      PersonDetailsResponse,
      { personId: number; lang?: string }
    >({
      query: ({ personId, lang = "en" }) => ({
        url: `?path=person/${personId}&append_to_response=images,combined_credits,movie_credits,tv_credits,external_ids&language=${lang}`,
        method: "GET",
      }),
      providesTags: (result, error, { personId }) => [
        {
          type: "PersonDetails",
          id: personId,
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // !TV Seasons Details
    getTvSeasonDetails: builder.query<
      TvSeasonDetailsResponse,
      TvSeasonDetailsQueryParams
    >({
      query: ({ tvShowId, seasonNumber, lang = "en" }) => ({
        url: `?path=tv/${tvShowId}/season/${seasonNumber}&language=${lang}`,
        method: "GET",
      }),
      providesTags: (result, error, { tvShowId, seasonNumber }) => [
        {
          type: "TvSeasonDetails",
          id: `${tvShowId}-${seasonNumber}`,
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // !Search multi
    getSearch: builder.query<
      SearchMultiPersonResponse | SearchMultiMovieTvResponse,
      SearchQueryParams
    >({
      query: ({ query, page = 1, lang = "en" }) => ({
        url: `?path=search/multi&query=${query}&page=${page}&language=${lang}`,
        method: "GET",
      }),
      providesTags: (result, error, { query, page }) => [
        {
          type: "SearchMulti",
          id: `${query}-${page}`,
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // ! Search Movies
    getSearchMovies: builder.query<SearchMovieResponse, SearchMovieQueryParams>(
      {
        query: ({ query, page = 1, lang = "en" }) => ({
          url: `?path=search/movie&query=${query}&page=${page}&language=${lang}`,
          method: "GET",
        }),
        providesTags: (result, error, { query, page }) => [
          {
            type: "SearchMovies",
            id: `${query}-${page}`,
          },
        ],
      },
    ),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // !Search TV Shows
    getSearchTvShows: builder.query<
      SearchTvShowResponse,
      SearchTvShowQueryParams
    >({
      query: ({ query, page = 1, lang = "en" }) => ({
        url: `?path=search/tv&query=${query}&page=${page}&language=${lang}`,
        method: "GET",
      }),
      providesTags: (result, error, { query, page }) => [
        {
          type: "SearchTvShows",
          id: `${query}-${page}`,
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // !Search People
    getSearchPeople: builder.query<
      SearchPersonResponse,
      SearchPersonQueryParams
    >({
      query: ({ query, page = 1, lang = "en" }) => ({
        url: `?path=search/person&query=${query}&page=${page}&language=${lang}`,
        method: "GET",
      }),
      providesTags: (result, error, { query, page }) => [
        {
          type: "SearchPeople",
          id: `${query}-${page}`,
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // !NowPlaying Movies
    getNowPlaying: builder.query<
      NowPlayingMoviesResponse,
      NowPlayingMoviesQueryParams
    >({
      query: ({ lang = "en", page = 1 }) => ({
        url: `?path=movie/now_playing&language=${lang}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["NowPlayingMovies"],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // !Popular
    getPopular: builder.query<
      PopularMoviesResponse | PopularTvShowResponse | PopularPersonResponse,
      PopularQueryParams
    >({
      query: ({ lang = "en", page = 1, showType }) => ({
        url: `?path=${showType}/popular&language=${lang}&page=${page}`,
        method: "GET",
      }),
      providesTags: (result, error, { showType }) => [
        {
          type:
            showType === "movie"
              ? "PopularMovies"
              : showType === "tv"
                ? "PopularTvShows"
                : "PopularPeople",
        },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    //!Top Rated
    getTopRated: builder.query<
      TopRatedMoviesResponse | TopRatedTvShowResponse,
      TopRatedMoviesTvQueryParams
    >({
      query: ({ lang = "en-US", page = 1, showType }) => ({
        url: `?path=${showType}/top_rated&language=${lang}&page=${page}`,
        method: "GET",
      }),
      providesTags: (result, error, { showType }) => [
        { type: showType === "movie" ? "TopRatedMovies" : "TopRatedTvShows" },
      ],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // !Upcoming Movies
    getUpcomingMovies: builder.query<
      UpcomingMoviesResponse,
      UpcomingMoviesQueryParams
    >({
      query: ({ lang = "en-US", page = 1 }) => ({
        url: `?path=movie/upcoming&language=${lang}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["UpcomingMovies"],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // !tv airing_today
    getAiringToday: builder.query<AiringTodayResponse, AiringTodayQueryParams>({
      query: ({ lang = "en-US", page = 1 }) => ({
        url: `?path=tv/airing_today&language=${lang}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["AiringToday"],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // !tv on_the_air
    getOnTheAir: builder.query<OnTheAirResponse, OnTheAirQueryParams>({
      query: ({ lang = "en-US", page = 1 }) => ({
        url: `?path=tv/on_the_air&language=${lang}&page=${page}`,
        method: "GET",
      }),
      providesTags: ["OnTheAir"],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // ! get movie collections
    getMovieCollection: builder.query<
      MovieCollectionResponse,
      MovieCollectionQueryParams
    >({
      query: ({ lang = "en", collectionId }) => ({
        url: `?path=collection/${collectionId}&language=${lang}`,
        method: "GET",
      }),
      providesTags: ["MovieCollection"],
    }),
    //-----------------------------------------------------------------------------------------------------------------
    //-----------------------------------------------------------------------------------------------------------------
    // ! collection translations
    getCollectionTranslations: builder.query<
      MovieCollectionTranslationsResponse,
      { collectionId: string }
    >({
      query: ({ collectionId }) => ({
        url: `?path=collection/${collectionId}/translations`,
        method: "GET",
      }),
      providesTags: ["CollectionTranslations"],
    }),
  }),
});

export default tmdbApi;

export const {
  useGetVideosQuery,
  useLazyGetVideosQuery,
  useGetMoviesTvShowsQuery,
  useGetImagesQuery,
  useGetReviewsQuery,
  useGetPersonDetailsQuery,
  useLazyGetPersonDetailsQuery,
  useGetTvSeasonDetailsQuery,
  useGetSearchQuery,
  useLazyGetSearchQuery,
  useGetSearchMoviesQuery,
  useGetSearchTvShowsQuery,
  useGetSearchPeopleQuery,
  useGetNowPlayingQuery,
  useGetPopularQuery,
  useGetTopRatedQuery,
  useGetUpcomingMoviesQuery,
  useGetAiringTodayQuery,
  useGetOnTheAirQuery,
  useGetGenresQuery,
  useGetTranslationsQuery,
  useLazyGetTranslationsQuery,
  useGetEpisodeTranslationsQuery,
  useLazyGetEpisodeTranslationsQuery,
  useGetTrendsQuery,
  useLazyGetTrendsQuery,
  useGetMTDetailsQuery,
  useLazyGetMTDetailsQuery,
  useGetCreditsQuery,
  useGetMovieCollectionQuery,
} = tmdbApi;
