export interface SearchMultiMovieTvResponse {
  page: number;
  results: SearchMultiTVShow[] | SearchMultiMovie[];
  total_pages: number;
  total_results: number;
}

export interface SearchMedia {
  backdrop_path: string;
  id: number;
  overview: string;
  poster_path: string;
  media_type: "tv" | "movie";
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  vote_average: number;
  vote_count: number;
}

export interface SearchMultiTVShow extends SearchMedia {
  name: string;
  original_name: string;
  first_air_date: string;
  origin_country: string[];
}

export interface SearchMultiMovie extends SearchMedia {
  title: string;
  original_title: string;
  release_date: string;
  video: boolean;
}

// person ---------------------------------------------------------------

export interface SearchMultiPersonResponse {
  page: number;
  results: SearchMultiPerson[];
  total_pages: number;
  total_results: number;
}

export interface SearchMultiPerson {
  id: number;
  name: string;
  original_name: string;
  media_type: "person";
  adult: boolean;
  popularity: number;
  gender: number;
  known_for_department: string;
  profile_path: string;
  known_for: SearchMultiPersonKnownFor[];
}

export interface SearchMultiPersonKnownFor {
  backdrop_path: string;
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string;
  media_type: "tv" | "movie";
  adult: boolean;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  origin_country?: string[];
}
//////////////////////

export interface SearchQueryParams {
  query: string;
  page?: number;
  lang?: string;
}
