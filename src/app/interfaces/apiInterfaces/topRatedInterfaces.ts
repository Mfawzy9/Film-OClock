export interface TopRatedMovieI {
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

export interface TopRatedMoviesResponse {
  page: number;
  results: TopRatedMovieI[];
  total_pages: number;
  total_results: number;
}

// TV ------------------------------------------------------------------

export interface TopRatedTvShowI {
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

export interface TopRatedTvShowResponse {
  page: number;
  results: TopRatedTvShowI[];
  total_pages: number;
  total_results: number;
}

///-------------------------

export interface TopRatedMoviesTvQueryParams {
  lang?: string;
  page?: number;
  showType: "movie" | "tv";
}
