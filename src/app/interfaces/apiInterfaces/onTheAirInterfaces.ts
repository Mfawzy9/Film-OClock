export interface OnTheAirI {
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

export interface OnTheAirResponse {
  page: number;
  results: OnTheAirI[];
  total_pages: number;
  total_results: number;
}

///-----------

export interface OnTheAirQueryParams {
  lang?: string;
  page?: number;
  region?: string;
}
