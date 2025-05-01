import { useGetGenresQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { useMemo } from "react";
import { genre } from "../interfaces/apiInterfaces/genresInterfaces";
import {
  MovieDetailsResponse,
  TvDetailsResponse,
} from "../interfaces/apiInterfaces/detailsInterfaces";

export const useGetGenres = ({
  showType,
  lang = "en",
}: {
  showType: "movie" | "tv";
  lang?: "en" | "ar";
}) => {
  const { data, isLoading: genresLoading } = useGetGenresQuery({
    showType,
    lang,
  });

  const genres = useMemo(() => {
    return (genresIds: number[]) =>
      genresIds?.map((_id) => {
        const genre = data?.genres.find((_genre: genre) => _genre.id === _id);
        return genre ? genre.name : "Unknown Genre";
      });
  }, [data]);

  const translatedGenres = useMemo(() => {
    return (show: MovieDetailsResponse | TvDetailsResponse) => {
      const genresIds = show?.genres?.map(({ id }) => id);
      const genresNames = genres(genresIds as number[]);

      return genresIds?.map((id, index) => ({
        id,
        genreName: genresNames[index],
      }));
    };
  }, [genres]);

  return { genres, genresLoading, translatedGenres };
};
