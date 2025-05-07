export interface MovieCollectionTranslationsResponse {
  id: number;
  translations: Translation[];
}

export interface Translation {
  iso_3166_1: string;
  iso_639_1: string;
  name: string;
  english_name: string;
  data: TranslationData;
}

export interface TranslationData {
  title: string;
  overview: string;
  homepage: string;
}
