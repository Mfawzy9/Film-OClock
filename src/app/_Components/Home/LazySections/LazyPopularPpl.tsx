import { useGetPopularQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import CardsSlider from "../../CardsSlider/CardsSlider";
import { useTranslations } from "next-intl";
import { SearchPerson } from "@/app/interfaces/apiInterfaces/searchPersonInterfaces";

const LazyPopularPpl = () => {
  const t = useTranslations("HomePage");
  const { data: popularPeople, isLoading: popularLoading } = useGetPopularQuery(
    { page: 1, showType: "person" },
  );
  return (
    <CardsSlider
      showType="person"
      sliderType="People"
      title={t("PopularCelebritiesSliderTitle")}
      pageLink="/people/Popular"
      theShows={(popularPeople?.results as SearchPerson[]) || []}
      isLoading={popularLoading}
      autoPlay={false}
    />
  );
};

export default LazyPopularPpl;
