export interface MovieImagesI {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface MovieImagesResponse {
  backdrops: MovieImagesI[];
  id: number;
  logos: MovieImagesI[];
  posters: MovieImagesI[];
}

// TV --------------------------------------------------------------

export interface TvImagesI {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface TvImagesResponse {
  backdrops: TvImagesI[];
  id: number;
  logos: TvImagesI[];
  posters: TvImagesI[];
}

// Person ----------------------------------------------------------

export interface PersonImagesI {
  aspect_ratio: number;
  height: number;
  iso_639_1: string | null;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}

export interface PersonImagesResponse {
  id: number;
  profiles: PersonImagesI[];
}

/////////////////////////////////////////////////////////////////////////////

export interface ImagesQueryparams {
  showId: number;
  showType: "movie" | "tv" | "person";
  lang?: string;
}
