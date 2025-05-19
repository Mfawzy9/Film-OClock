export interface MovieTranslationsResponse {
  id: number;
  translations: MovieTranslation[];
}

export interface MovieTranslation {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: MovieTranslationData;
}

export interface MovieTranslationData {
  homepage: string;
  overview: string;
  runtime: number;
  tagline: string;
  title: string;
}

// tv ------------------------------------------------------------------------

export interface TvTranslationData {
  name: string;
  overview: string;
  homepage: string;
  tagline: string;
}

export interface TvTranslation {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: TvTranslationData;
}

export interface TvTranslationsResponse {
  id: number;
  translations: TvTranslation[];
}
