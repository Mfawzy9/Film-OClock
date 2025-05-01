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
  iso_3166_1: string; // Country code (e.g., "US")
  iso_639_1: string; // Language code (e.g., "en")
  name: string; // Language name (e.g., "English")
  english_name: string; // English name of the language (e.g., "English")
  data: TvTranslationData; // Data related to the translation
}

export interface TvTranslationsResponse {
  id: number; // Unique movie ID
  translations: TvTranslation[]; // List of translations
}
