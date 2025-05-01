export interface MovieReviewsResponse {
  id: number;
  page: number;
  results: MovieReviewI[];
  total_pages: number;
  total_results: number;
}

export interface MovieAuthorDetails {
  name: string;
  username: string;
  avatar_path: string | null;
  rating: number;
}

export interface MovieReviewI {
  author: string;
  author_details: MovieAuthorDetails;
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

// TV --------------------------------------------------------------

export interface TvAuthorDetails {
  name: string;
  username: string;
  avatar_path: string;
  rating: number;
}

export interface TvReviewI {
  author: string;
  author_details: TvAuthorDetails;
  content: string;
  created_at: string;
  id: string;
  updated_at: string;
  url: string;
}

export interface TvReviewsResponse {
  id: number;
  page: number;
  results: TvReviewI[];
  total_pages: number;
  total_results: number;
}

//////////////////////////////////////////

export interface ReviewsQueryParams {
  lang?: string;
  page?: number;
  showId: number;
  showType: "movie" | "tv";
}
