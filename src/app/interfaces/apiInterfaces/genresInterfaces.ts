export interface GenresResponse {
  genres: genre[];
}

export interface genre {
  id: number;
  name: string;
}

export interface movieGenres {
  genres?: number[];
}

export interface tvShowsGenres {
  genres?: number[];
}

// -----------------------

export interface GenresQueryParams {
  showType: "movie" | "tv";
  lang?: string;
}
