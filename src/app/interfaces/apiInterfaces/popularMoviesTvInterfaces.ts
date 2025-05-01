export interface PopularMovieI {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface PopularMoviesResponse {
  page: number;
  results: PopularMovieI[];
  total_pages: number;
  total_results: number;
}

// TV -------------------------------------------------------------------------

export interface PopularTvShowI {
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
}

export interface PopularTvShowResponse {
  page: number;
  results: PopularTvShowI[];
  total_pages: number;
  total_results: number;
}

// Person ---------------------------------------------------------------------

export interface PopularPersonResponse {
  page: number;
  results: PopularPersonI[];
  total_pages: number;
  total_results: number;
}

export interface PopularPersonI {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  known_for: PopularPersonMovieI[] | PopularPersonTvShowI[];
}

export interface PopularPersonMovieI {
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

export interface PopularPersonTvShowI {
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

//------------------------------------------------

export interface PopularQueryParams {
  lang?: string;
  page?: number;
  showType: "movie" | "tv" | "person";
}
