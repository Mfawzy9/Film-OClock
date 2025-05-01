export interface SearchPersonKnownFor {
  backdrop_path: string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string;
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

export interface SearchPerson {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string;
  known_for: SearchPersonKnownFor[];
}

export interface SearchPersonResponse {
  page: number;
  results: SearchPerson[];
  total_pages: number;
  total_results: number;
}

///------------------

export interface SearchPersonQueryParams {
  query: string;
  page?: number;
  lang?: string;
}
