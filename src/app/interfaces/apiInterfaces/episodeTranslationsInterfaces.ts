export interface EpisodeTranslationsResponse {
  id: number;
  translations: EpisodeTranslation[];
}

export interface EpisodeTranslation {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: EpisodeTranslationData;
}

export interface EpisodeTranslationData {
  name: string;
  overview: string;
}

export interface EpisodeTranslationQueryParams {
  showId: number;
  episodeId: number;
  eNumber: number;
  sNumber: number;
}
