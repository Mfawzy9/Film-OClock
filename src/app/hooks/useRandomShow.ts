"use client";
import { useMemo } from "react";
import { Movie, TVShow } from "../interfaces/apiInterfaces/discoverInterfaces";

export const useRandomShow = (movies: Movie[] | TVShow[]) => {
  return useMemo(() => {
    if (!movies || movies.length === 0) return null;

    const filteredMovies = movies?.filter((movie) => movie.backdrop_path);

    const randomIndex = Math.floor(Math.random() * filteredMovies.length);
    return movies[randomIndex];
  }, [movies]);
};
