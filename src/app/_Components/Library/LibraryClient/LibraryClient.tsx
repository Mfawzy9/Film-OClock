"use client";

import { useGetLibraryQuery } from "@/lib/Redux/apiSlices/firestoreSlice";
import { RootState } from "@/lib/Redux/store";
import { useDispatch, useSelector } from "react-redux";
import PageSection from "../../PageSection/PageSection";
import { useEffect, useMemo, useState } from "react";
import {
  setFavorites,
  setWatchlist,
} from "@/lib/Redux/localSlices/librarySlice";
import MainLoader from "../../MainLoader/MainLoader";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import useLibrary, { FirestoreTheShowI } from "@/app/hooks/useLibrary";
import WlCard from "../WlCard/WlCard";
import TitleClearBtn from "../TitleClearBtn/TitleClearBtn";
import EmptyWl from "../EmptyWl/EmptyWl";
import EmptyFav from "../EmptyFav/EmptyFav";
import LibSearch from "../LibSearch/LibSearch";
import { useTranslations } from "next-intl";
import CardsSlider from "../../CardsSlider/CardsSlider";
import { useRouter as useNextIntlRouter } from "@/i18n/navigation";
import { useRouter } from "@bprogress/next";
import { getCookie } from "../../../../../helpers/helpers";

const LibraryClient = () => {
  const { libraryType } = useParams<{
    libraryType: "watchlist" | "favorites";
  }>();
  const router = useRouter({ customRouter: useNextIntlRouter });

  if (libraryType !== "watchlist" && libraryType !== "favorites") notFound();

  const t = useTranslations("Library");

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authReducer);

  // prevent refetch on mount/focus
  const {
    data: getLibrary,
    isLoading,
    isFetching,
  } = useGetLibraryQuery(
    { userId: user?.uid || "", library: libraryType },
    { skip: !user },
  );

  const {
    handleClearLibrary,
    isClearLoading,
    favorites,
    watchlist,
    favoritesLoading,
    watchlistLoading,
  } = useLibrary({});

  useEffect(() => {
    if (getLibrary) {
      if (libraryType === "watchlist") {
        dispatch(setWatchlist(getLibrary));
      } else {
        dispatch(setFavorites(getLibrary));
      }
    }
  }, [getLibrary, dispatch, libraryType]);

  const movies = useMemo(() => {
    return libraryType === "watchlist"
      ? watchlist.filter((show) => show.showType === "movie")
      : favorites.filter((show) => show.showType === "movie");
  }, [watchlist, favorites, libraryType]);

  const tvShows = useMemo(() => {
    return libraryType === "watchlist"
      ? watchlist.filter((show) => show.showType === "tv")
      : favorites.filter((show) => show.showType === "tv");
  }, [watchlist, favorites, libraryType]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredWatchlist = useMemo(() => {
    if (!searchTerm) return watchlist;

    const lowerSearch = searchTerm.toLowerCase();

    return watchlist.filter((show) =>
      show.title.toLowerCase().includes(lowerSearch),
    );
  }, [watchlist, searchTerm]);

  useEffect(() => {
    const isLoggedOut = getCookie("loggedOut") === "true";

    if (isLoggedOut) {
      router.push("/auth/login");
    }
  }, [router]);

  if (isLoading || !user) return <MainLoader />;

  return (
    user && (
      <>
        {/* Empty */}
        {libraryType === "watchlist" && watchlist.length === 0 ? (
          <EmptyWl />
        ) : libraryType === "favorites" && favorites.length === 0 ? (
          <EmptyFav />
        ) : (
          <PageSection>
            {/* Clear button */}
            {(movies?.length > 0 || tvShows?.length > 0) && (
              <TitleClearBtn
                handleClearLibrary={handleClearLibrary}
                libraryType={libraryType}
                isClearLoading={isClearLoading}
                watchlistLength={watchlist.length}
                favoritesLength={favorites.length}
              />
            )}

            {/* Watchlist shows */}
            {libraryType === "watchlist" && watchlist?.length > 0 && (
              <>
                {watchlist.length > 2 && (
                  <LibSearch
                    setSearchTerm={setSearchTerm}
                    searchTerm={searchTerm}
                    libraryWord="Watchlist"
                  />
                )}
                <main className="grid place-items-center sm:place-items-start gap-y-10">
                  {filteredWatchlist.map((show: FirestoreTheShowI) => (
                    <motion.div
                      className={`${isLoading || isFetching || watchlistLoading ? "pointer-events-none opacity-50 animate-pulse" : ""}`}
                      key={`${libraryType}-${show.id}`}
                      layout
                    >
                      <WlCard show={show} />
                    </motion.div>
                  ))}
                </main>
                {filteredWatchlist.length === 0 && (
                  <p className="text-center text-3xl py-5">
                    {t("Watchlist.SearchNotFound")}
                  </p>
                )}
              </>
            )}

            {/* Favorites movies */}
            {libraryType === "favorites" && movies?.length > 0 && (
              <div
                className={`${isLoading || favoritesLoading || isFetching ? "pointer-events-none opacity-50 animate-pulse" : ""}`}
              >
                <CardsSlider
                  theShows={movies}
                  showType="movie"
                  sliderType="movies"
                  title={t("Favourites.Movies")}
                  isLoading={false}
                  arrLength={movies.length}
                  className="mb-10"
                />
              </div>
            )}

            {/* Favorites tv shows */}
            {libraryType === "favorites" && tvShows?.length > 0 && (
              <div
                className={`${isLoading || favoritesLoading || isFetching ? "pointer-events-none opacity-50 animate-pulse" : ""}`}
              >
                <CardsSlider
                  theShows={tvShows}
                  showType="tv"
                  sliderType="tvShows"
                  title={t("Favourites.TvShows")}
                  isLoading={false}
                  arrLength={tvShows.length}
                />
              </div>
            )}
          </PageSection>
        )}
      </>
    )
  );
};

export default LibraryClient;
