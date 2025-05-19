import { MoviesTrendsResponse } from "@/app/interfaces/apiInterfaces/trendsInterfaces";
import { getLocale } from "next-intl/server";
import {
  getTrendingWithNextCache,
  getGenresWithNextCache,
} from "../../../lib/tmdbRequests";
import dynamic from "next/dynamic";
import { RTKPreloader } from "../helpers/RTKPreloader";
import { itemTypeMap } from "../../../../helpers/serverHelpers";

const HomeSlider = dynamic(() => import("./HomeSlider"));

const HomeSliderFetcher = async () => {
  const locale = await getLocale();
  const { trending } = await getTrendingWithNextCache({
    locale,
    showType: "movie",
    homePge: true,
  });

  const { genres } = await getGenresWithNextCache({
    locale,
    showType: "movie",
  });

  return (
    <>
      {trending && (
        <RTKPreloader
          preloadedQueries={[
            {
              endpointName: "getTrends",
              args: {
                lang: locale,
                showType: "movie",
                dayOrWeek: "day",
                page: 1,
              },
              data: trending,
            },
            {
              endpointName: "getGenres",
              args: {
                showType: "movie",
                lang: locale,
              },
              data: genres,
            },
          ]}
        />
      )}

      <section className="sr-only">
        {(trending as MoviesTrendsResponse)?.results?.map((movie) => (
          <article itemScope itemType={itemTypeMap["movie"]} key={movie.id}>
            <h1 itemProp="name">
              {locale === "ar" ? movie.original_title : movie.title}
            </h1>
            <h2 itemProp="alternateName">{movie.original_title}</h2>
            <p itemProp="description">{movie.overview}</p>
            <time itemProp="datePublished">{movie.release_date}</time>
          </article>
        ))}
      </section>
      {trending && genres && (
        <HomeSlider
          data={(trending as MoviesTrendsResponse) || []}
          genres={genres}
        />
      )}
    </>
  );
};

export default HomeSliderFetcher;
