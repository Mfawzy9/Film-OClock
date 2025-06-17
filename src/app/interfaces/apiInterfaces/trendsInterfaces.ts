export interface AllTrendsResponse {
  page: number;
  results: AllTrendsI[];
  total_pages: number;
  total_results: number;
}

export interface AllTrendsI {
  backdrop_path: string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: "movie" | "tv" | "person";
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MoviesTrendsResponse {
  page: number;
  results: MovieTrendsI[];
  total_pages: number;
  total_results: number;
}

export interface MovieTrendsI {
  backdrop_path: string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
  media_type: "movie";
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TVShowsTrendsResponse {
  page: number;
  results: TVShowTrendsI[];
  total_pages: number;
  total_results: number;
}

export interface TVShowTrendsI {
  backdrop_path: string;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  media_type: "tv";
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  origin_country: string[];
}

export interface PplTrendsResponse {
  page: number;
  results: PplTrendsI[];
  total_pages: number;
  total_results: number;
}

export interface PplTrendsI {
  id: number;
  name: string;
  original_name: string;
  media_type: "person";
  adult: boolean;
  popularity: number;
  gender: number;
  known_for_department: string;
  profile_path: string;
}

export type TrendType = "all" | "movie" | "tv" | "person";

export interface TrendsQueryParams {
  lang?: string;
  showType: TrendType;
  dayOrWeek?: "day" | "week";
  page: number;
}
