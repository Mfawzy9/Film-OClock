export interface NowPlayingMoviesResponse {
  dates: NowPlayingMoviesDates;
  page: number;
  results: NowPlayingMovieI[];
  total_pages: number;
  total_results: number;
}

export interface NowPlayingMoviesDates {
  maximum: string;
  minimum: string;
}

export interface NowPlayingMovieI {
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

//////--------

export interface NowPlayingMoviesQueryParams {
  lang?: string;
  page?: number;
}
