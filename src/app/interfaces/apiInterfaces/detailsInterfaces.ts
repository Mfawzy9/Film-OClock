import { MovieCreditsResponse, TvCreditsResponse } from "./creditsInterfaces";
import { ExternalIDsResponse } from "./externalIDsInterfaces";
import { MovieImagesResponse, TvImagesResponse } from "./imagesInterfaces";
import {
  MovieRecommendationsResponse,
  TvRecommendationsResponse,
} from "./recommendationsInterfaces";
import { MovieReviewsResponse, TvReviewsResponse } from "./reviewsInterfaces";
import {
  MovieSimilarsResponse,
  TvShowSimilarsResponse,
} from "./similarInterfaces";
import { VideosResponse } from "./videosInterfaces";

export interface MovieDetailsGenre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface MovieDetailsResponse {
  adult: boolean;
  backdrop_path: string | null;
  belongs_to_collection: null | object;
  budget: number;
  genres: MovieDetailsGenre[];
  homepage: string;
  id: number;
  imdb_id: string;
  origin_country: string[];
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  release_date: string;
  revenue: number;
  runtime: number | null;
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  //append_to_response
  videos: Omit<VideosResponse, "id">;
  images: Omit<MovieImagesResponse, "id">;
  external_ids: Omit<ExternalIDsResponse, "id">;
  credits: Omit<MovieCreditsResponse, "id">;
  recommendations: MovieRecommendationsResponse;
  similar: MovieSimilarsResponse;
  reviews: Omit<MovieReviewsResponse, "id">;
}

// TV --------------------------------------------------------------

export interface Creator {
  id: number;
  credit_id: string;
  name: string;
  original_name: string;
  gender: number;
  profile_path: string | null;
}

export interface TvDetailsGenre {
  id: number;
  name: string;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  vote_average: number;
  vote_count: number;
  air_date: string;
  episode_number: number;
  episode_type: string;
  production_code: string;
  runtime: number;
  season_number: number;
  show_id: number;
  still_path: string | null;
}

export interface Network {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCompany {
  id: number;
  logo_path: string | null;
  name: string;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface Season {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  vote_average: number;
}

export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

export interface TvDetailsResponse {
  adult: boolean;
  backdrop_path: string | null;
  created_by: Creator[];
  episode_run_time: number[];
  first_air_date: string;
  genres: TvDetailsGenre[];
  homepage: string;
  id: number;
  in_production: boolean;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: Episode;
  name: string;
  next_episode_to_air: Episode | null;
  networks: Network[];
  number_of_episodes: number;
  number_of_seasons: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  seasons: Season[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
  //append_to_response
  videos: Omit<VideosResponse, "id">;
  images: Omit<TvImagesResponse, "id">;
  external_ids: Omit<ExternalIDsResponse, "id">;
  credits: Omit<TvCreditsResponse, "id">;
  recommendations: TvRecommendationsResponse;
  similar: TvShowSimilarsResponse;
  reviews: Omit<TvReviewsResponse, "id">;
}

// Person --------------------------------------------------------------

export interface PersonDetailsResponse {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
  images: PImages;
  combined_credits: PCombinedCredits;
  movie_credits: PMovieCredits;
  tv_credits: PTvCredits;
  external_ids: PExternalIds;
}

export interface PImages {
  profiles: ProfileImage[];
}

export interface ProfileImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface PCombinedCredits {
  cast: PMovieCast[] | PTvCast[];
  crew: PMovieCrew[] | PTvCrew[];
}

export interface PMovieCredits {
  cast: PMovieCast[];
  crew: PMovieCrew[];
}

export interface PTvCredits {
  cast: PTvCast[];
  crew: PTvCrew[];
}

export interface PMovieCast {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title?: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date?: string;
  title?: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  character: string;
  credit_id: string;
  order?: number;
  media_type?: string;
}

export interface PMovieCrew {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title?: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date?: string;
  title?: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  credit_id: string;
  department: string;
  job: string;
  media_type?: string;
}

export interface PTvCast {
  media_type: string;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
  character: string;
  credit_id: string;
  episode_count: number;
}

export interface PTvCrew {
  media_type: string;
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
  credit_id: string;
  department: string;
  episode_count: number;
  job: string;
}

export interface PExternalIds {
  freebase_mid: string | null;
  freebase_id: string | null;
  imdb_id: string | null;
  tvrage_id: number | null;
  wikidata_id: string | null;
  facebook_id: string | null;
  instagram_id: string | null;
  tiktok_id: string | null;
  twitter_id: string | null;
  youtube_id: string | null;
}

//-----------------------------------

export interface DetailsQueryParams {
  showId: number;
  showType: "movie" | "tv" | "person";
  lang?: string;
}
