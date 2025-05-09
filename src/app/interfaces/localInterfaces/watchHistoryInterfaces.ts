export interface WatchHistoryItem {
  id: number;
  showType: "movie" | "tv";
  title: string;
  overview: string;
  episodeOverview?: string;
  posterPath: string;
  backdropPath: string;
  progress: {
    watched: number;
    duration: number;
    percentage: number;
  };
  watchedAt: string;
  watchedTime: string;
  watchedCount: number;
  releaseDate: string;
  movieRuntime?: number;
  episodeRuntime?: number;
  season?: number;
  episode?: number;
  rating: number;
  genresIds: number[];
  oriTitle: string;
  original_language: string;
}

export interface WatchedTvShowHistoryItem {
  id: number;
  showType: string;
  title: string;
  overview: string;
  episodeOverview: string;
  posterPath: string | null;
  backdropPath: string | null;
  season: number;
  episode: number;
  episodeRuntime: number;
  progress: {
    watched: number;
    duration: number;
    percentage: number;
  };
  watchedAt: string;
  watchedTime: string;
  watchedCount: number;
  releaseDate: string | null;
  rating: number;
  genresIds: number[];
  oriTitle: string;
  original_language: string;
}

export interface WatchedMovieHistoryItem {
  id: number;
  showType: string;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  movieRuntime: number;
  progress: {
    watched: number;
    duration: number;
    percentage: number;
  };
  watchedAt: string;
  watchedTime: string;
  watchedCount: number;
  releaseDate: string | null;
  rating: number;
  genresIds: number[];
  oriTitle: string;
  original_language: string;
}
