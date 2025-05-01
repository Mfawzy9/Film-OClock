import { genre } from "@/app/interfaces/apiInterfaces/genresInterfaces";
import { useMemo } from "react";
import GenresSlider from "../GenresSlider/GenresSlider";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { useTranslations } from "next-intl";

interface GenresSectionProps {
  genresList: genre[];
  moviesOrTvShows: Movie[] | TVShow[];
  pageLink: string;
  showType: "movie" | "tv";
  isLoading: boolean;
}

const GenresSection = ({
  genresList,
  moviesOrTvShows,
  pageLink,
  showType,
  isLoading,
}: GenresSectionProps) => {
  const t = useTranslations("HomePage");
  const genresBackdrops = useMemo(() => {
    const genreMap = new Map<number, string>(); // Store first unique backdrop for each genre
    const usedBackdrops = new Set<string>(); // Track used backdrops

    moviesOrTvShows?.forEach((movie) => {
      movie.genre_ids.forEach((id) => {
        // Only assign a backdrop if the genre hasn't been assigned one and the backdrop is unique
        if (
          !genreMap.has(id) &&
          movie.backdrop_path &&
          !usedBackdrops.has(movie.backdrop_path)
        ) {
          genreMap.set(id, movie.backdrop_path); // Assign the backdrop to the genre
          usedBackdrops.add(movie.backdrop_path); // Mark the backdrop as used
        }
      });
    });

    return genreMap;
  }, [moviesOrTvShows]);

  return (
    <>
      <GenresSlider
        genresList={genresList}
        title={t("TopGenresSliderTitle")}
        pageLink={pageLink}
        genresBackdrops={genresBackdrops}
        showType={showType}
        isLoading={isLoading}
      />
    </>
  );
};

export default GenresSection;
