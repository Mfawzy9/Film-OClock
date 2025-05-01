export interface VideosResults {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}

export interface VideosResponse {
  id: number;
  results: VideosResults[];
}

export interface VideosQueryParams {
  showId: number;
  showType: "movie" | "tv";
  lang?: string;
}
