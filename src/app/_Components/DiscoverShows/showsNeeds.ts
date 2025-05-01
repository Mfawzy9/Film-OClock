import { TFunction } from "../../../../global";

export const filterOptionsWithT = ({ t }: { t: TFunction }) => {
  return {
    sortItems: [
      {
        query: "popularity.desc",
        name: t("Filters.SortBy.Options.Popularity"),
      },
      { query: "vote_count.desc", name: t("Filters.SortBy.Options.MostVoted") },
      {
        query: "vote_average.desc",
        name: t("Filters.SortBy.Options.TopRated"),
      },
      {
        query: "release_date.desc",
        name: t("Filters.SortBy.Options.NewToOld"),
      },
      { query: "release_date.asc", name: t("Filters.SortBy.Options.OldToNew") },
    ],
    oriLangs: [
      { query: "", name: t("Filters.OriLangs.Options.All") },
      { query: "ar", name: t("Filters.OriLangs.Options.Arabic") },
      { query: "en", name: t("Filters.OriLangs.Options.English") },
      { query: "fr", name: t("Filters.OriLangs.Options.French") },
      { query: "de", name: t("Filters.OriLangs.Options.German") },
      { query: "it", name: t("Filters.OriLangs.Options.Italian") },
      { query: "es", name: t("Filters.OriLangs.Options.Spanish") },
      { query: "ja", name: t("Filters.OriLangs.Options.Japanese") },
      { query: "ko", name: t("Filters.OriLangs.Options.Korean") },
      { query: "ru", name: t("Filters.OriLangs.Options.Russian") },
    ],
    ratings: [
      { query: "", name: t("Filters.Ratings.Options.Random") },
      { query: "8", name: "⭐8+" },
      { query: "7", name: "⭐7+" },
      { query: "6", name: "⭐6+" },
      { query: "5", name: "⭐5+" },
      { query: "4", name: "⭐4+" },
      { query: "3", name: "⭐3+" },
      { query: "2", name: "⭐2+" },
      { query: "1", name: "⭐1+" },
    ],
  };
};

export const yearsWithT = ({ t }: { t: any }) => {
  const defaultYear = { query: "", name: t("Filters.Years.Options.All") };
  const currentYear = new Date().getFullYear();
  return [
    ...Array.from({ length: currentYear - 1900 + 1 }, (_, index) => ({
      query: String(1900 + index),
      name: String(1900 + index),
    })),
    defaultYear,
  ].reverse();
};

const defaultYear = { query: "", name: "All Years" };
const currentYear = new Date().getFullYear();
export const years = [
  ...Array.from({ length: currentYear - 1900 + 1 }, (_, index) => ({
    query: String(1900 + index),
    name: String(1900 + index),
  })),
  defaultYear,
].reverse();

export type FilterItem = {
  query: string;
  name: string;
};

export type Filters = {
  rating: FilterItem;
  year: FilterItem;
  oriLang: FilterItem;
  sort: FilterItem;
  genres: FilterItem[];
};

export type FilterConfig = {
  id: keyof Filters;
  items: FilterItem[];
  label: string;
  setPage: boolean;
  multiSelect?: boolean;
  defaultOption?: string;
};
