import { SearchPerson } from "@/app/interfaces/apiInterfaces/searchPersonInterfaces";
import { getPopularWithNextCache } from "@/lib/tmdbRequests";
import { getTranslations } from "next-intl/server";
import { RTKPreloader } from "../helpers/RTKPreloader";
import PageSection from "../PageSection/PageSection";
import { PopularPersonResponse } from "@/app/interfaces/apiInterfaces/popularMoviesTvInterfaces";
import CardsSlider from "../CardsSlider/CardsSlider";
import { itemTypeMap } from "../../../../helpers/serverHelpers";

const PopularPplHomeSlider = async () => {
  const t = await getTranslations("HomePage");
  const { popular: popularPeople } = await getPopularWithNextCache({
    showType: "person",
    locale: "en",
  });

  return (
    <>
      {popularPeople && (
        <>
          <section className="sr-only">
            <h1>{t("PopularCelebritiesSliderTitle")}</h1>
            <article>
              {(popularPeople as PopularPersonResponse).results.map(
                (person) => (
                  <div
                    key={person.id}
                    itemScope
                    itemType={itemTypeMap["person"]}
                  >
                    <h1 itemProp="name">{person.name}</h1>
                    <h2 itemProp="alternateName">{person.original_name}</h2>
                    <h2 itemProp="jobTitle">{person.known_for_department}</h2>
                    <p itemProp="alternateName">
                      {person.known_for.join(", ")}
                    </p>
                    <p itemProp="gender">{person.gender}</p>
                  </div>
                ),
              )}
            </article>
          </section>

          <RTKPreloader
            preloadedQueries={[
              {
                endpointName: "getPopular",
                args: { showType: "person", page: 1 },
                data: popularPeople,
              },
            ]}
          />
        </>
      )}
      <PageSection>
        <CardsSlider
          showType="person"
          sliderType="People"
          title={t("PopularCelebritiesSliderTitle")}
          pageLink="/people/Popular"
          theShows={(popularPeople?.results as SearchPerson[]) || []}
          autoPlay={false}
        />
      </PageSection>
    </>
  );
};

export default PopularPplHomeSlider;
