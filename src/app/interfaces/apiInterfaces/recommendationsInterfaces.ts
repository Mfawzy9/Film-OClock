export interface MovieRecommendationsResponse {
  page: number;
  results: MovieRecommendationsI[];
  total_pages: number;
  total_results: number;
}

export interface MovieRecommendationsI {
  backdrop_path: string | null;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  media_type: string;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// Tv --------------------------------------------------------------

export interface TvRecommendationsResponse {
  page: number;
  results: TvRecommendationsI[];
  total_pages: number;
  total_results: number;
}

export interface TvRecommendationsI {
  backdrop_path: string | null;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  media_type: string;
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

/////////////////////////////////////////////////

export interface RecommendationsQueryParams {
  lang?: string;
  page?: number;
  showId: number;
  showType: "movie" | "tv";
}
