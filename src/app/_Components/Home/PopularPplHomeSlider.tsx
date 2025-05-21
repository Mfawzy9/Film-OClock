import { SearchPerson } from "@/app/interfaces/apiInterfaces/searchPersonInterfaces";
import { getPopularWithNextCache } from "@/lib/tmdbRequests";
import { getTranslations } from "next-intl/server";
import { RTKPreloader } from "../helpers/RTKPreloader";
import PageSection from "../PageSection/PageSection";
import { PopularPersonResponse } from "@/app/interfaces/apiInterfaces/popularMoviesTvInterfaces";
import { ensureMutable, itemTypeMap } from "../../../../helpers/serverHelpers";
import LazyRenderForServerParent from "../LazyRender/LazyRenderForServerParent";
import CardsSkeletonSlider from "../CardsSlider/CardsSkeletonSlider";
import dynamic from "next/dynamic";

const CardsSlider = dynamic(() => import("../CardsSlider/CardsSlider"));

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
            {(popularPeople as PopularPersonResponse).results.map((person) => (
              <article
                key={person.id}
                itemScope
                itemType={itemTypeMap["person"]}
              >
                <h1 itemProp="name">{person.name}</h1>
                <h2 itemProp="alternateName">{person.original_name}</h2>
                <h2 itemProp="jobTitle">{person.known_for_department}</h2>
                <p itemProp="alternateName">{person.known_for.join(", ")}</p>
                <p itemProp="gender">{person.gender}</p>
              </article>
            ))}
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
        <LazyRenderForServerParent
          persistKey="popularPpl-home"
          loading={<CardsSkeletonSlider />}
        >
          <CardsSlider
            showType="person"
            sliderType="People"
            title={t("PopularCelebritiesSliderTitle")}
            pageLink="/people/Popular"
            theShows={
              ensureMutable((popularPeople?.results as SearchPerson[]) || []) ||
              []
            }
            autoPlay={false}
          />
        </LazyRenderForServerParent>
      </PageSection>
    </>
  );
};

export default PopularPplHomeSlider;
