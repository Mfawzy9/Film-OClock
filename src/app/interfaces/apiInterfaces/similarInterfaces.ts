export interface MovieSimilarsResponse {
  page: number;
  results: MovieSimilarsI[];
  total_pages: number;
  total_results: number;
}

export interface MovieSimilarsI {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

// tv --------------------------------------------------------------

export interface TvShowSimilarsResponse {
  page: number;
  results: TvShowSimilarsI[];
  total_pages: number;
  total_results: number;
}

export interface TvShowSimilarsI {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  origin_country: string[];
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  first_air_date: string;
  name: string;
  vote_average: number;
  vote_count: number;
}

/////////////////////////////////////////////////////////

export interface SimilarsQueryParams {
  lang?: string;
  page?: number;
  showId: number;
  showType: "movie" | "tv";
}
