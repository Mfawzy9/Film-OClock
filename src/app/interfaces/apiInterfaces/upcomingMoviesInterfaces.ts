export interface DateRange {
  maximum: string;
  minimum: string;
}

export interface UpcomingMovieI {
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

export interface UpcomingMoviesResponse {
  dates: DateRange;
  page: number;
  results: UpcomingMovieI[];
  total_pages: number;
  total_results: number;
}

/////------------------------

export interface UpcomingMoviesQueryParams {
  lang?: string;
  page?: number;
  region?: string;
}
