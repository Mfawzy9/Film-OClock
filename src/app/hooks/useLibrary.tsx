"use client";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddToLibraryMutation,
  useRemoveFromLibraryMutation,
  useLazyIsInLibraryQuery,
  useClearLibraryMutation,
  useLazyGetLibraryQuery,
} from "@/lib/Redux/apiSlices/firestoreSlice";
import { RootState } from "@/lib/Redux/store";
import {
  Movie,
  TVShow,
} from "@/app/interfaces/apiInterfaces/discoverInterfaces";
import { toast } from "sonner";
import {
  MovieDetailsResponse,
  TvDetailsResponse,
} from "../interfaces/apiInterfaces/detailsInterfaces";
import {
  addToFavorites,
  addToWatchlist,
  clearFavorites,
  clearWatchlist,
  removeFromFavorites,
  removeFromWatchlist,
} from "@/lib/Redux/localSlices/librarySlice";
import { Link } from "@/i18n/navigation";
import { useLazyGetTranslationsQuery } from "@/lib/Redux/apiSlices/tmdbSlice";
import { useTranslations } from "next-intl";
import { useTranslateWithGoogleMutation } from "@/lib/Redux/apiSlices/translationSlice";
import { WatchHistoryItem } from "../interfaces/localInterfaces/watchHistoryInterfaces";

export type LibraryType = "watchlist" | "favorites";

export interface FirestoreTheShowI {
  title: string;
  arTitle: string;
  posterPath: string;
  backdropPath: string;
  releaseDate: string;
  id: number;
  rating: number;
  overview: string;
  arOverview: string;
  showType: "movie" | "tv";
  watchedAtDate?: string;
  watchedAtTime?: string;
  oriTitle: string;
  original_language: string;
}

export const updatedTheShow = (
  theShow: Movie | MovieDetailsResponse | TVShow | TvDetailsResponse,
  arabicTranslation?: { data?: { arTitle: string; arOverview: string } },
  watchedAt?: { watchedAtDate: string; watchedAtTime: string },
): FirestoreTheShowI => ({
  title:
    (theShow as Movie).title ||
    (theShow as Movie).original_title ||
    (theShow as TVShow).name ||
    (theShow as TVShow).original_name,
  arTitle: arabicTranslation?.data?.arTitle || "",
  oriTitle:
    (theShow as Movie).original_title || (theShow as TVShow).original_name,
  original_language: theShow.original_language,
  posterPath: (theShow as Movie | TVShow).poster_path,
  backdropPath: (theShow as Movie | TVShow).backdrop_path,
  releaseDate:
    (theShow as Movie).release_date || (theShow as TVShow).first_air_date,
  id: theShow.id,
  rating: theShow.vote_average,
  overview: theShow.overview,
  arOverview: arabicTranslation?.data?.arOverview || "",
  showType: "title" in theShow ? "movie" : "tv",
  watchedAtDate: watchedAt?.watchedAtDate || "",
  watchedAtTime: watchedAt?.watchedAtTime || "",
});

const useLibrary = ({
  dropDownMenu,
  showId,
  theShow,
}: {
  dropDownMenu: boolean;
  showId?: number;
  theShow?:
    | Movie
    | MovieDetailsResponse
    | TVShow
    | TvDetailsResponse
    | FirestoreTheShowI
    | WatchHistoryItem;
}) => {
  const t = useTranslations("Library");
  const showType =
    theShow && "showType" in theShow
      ? theShow.showType
      : theShow && "title" in theShow
        ? "movie"
        : "tv";
  const [libraryState, setLibraryState] = useState({
    watchlist: false,
    favorites: false,
  });
  const [loadingState, setLoadingState] = useState({
    watchlist: false,
    favorites: false,
    initialLoading: true,
  });

  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authReducer);
  const { watchlist, favorites } = useSelector(
    (state: RootState) => state.libraryReducer,
  );

  const [
    getLibrary,
    { isLoading: getLibraryLoading, isFetching: getLibraryFetching },
  ] = useLazyGetLibraryQuery();
  const [addToLibrary] = useAddToLibraryMutation();
  const [removeFromLibrary] = useRemoveFromLibraryMutation();
  const [isInLibrary] = useLazyIsInLibraryQuery();
  const [clearLibrary, { isLoading: isClearLoading }] =
    useClearLibraryMutation();

  const [getTranslations] = useLazyGetTranslationsQuery();

  //translate to arabic
  const [translate] = useTranslateWithGoogleMutation();

  useEffect(() => {
    if (user && dropDownMenu && showId) {
      (async () => {
        setLoadingState((prev) => ({ ...prev, initialLoading: true }));
        const [isInWatchlist, isInFavorites] = await Promise.all([
          isInLibrary({
            userId: user.uid,
            showId,
            library: "watchlist",
          }).unwrap(),
          isInLibrary({
            userId: user.uid,
            showId,
            library: "favorites",
          }).unwrap(),
        ]);
        setLibraryState({ watchlist: isInWatchlist, favorites: isInFavorites });
        setLoadingState((prev) => ({ ...prev, initialLoading: false }));
      })();
    } else {
      setLibraryState({ watchlist: false, favorites: false });
      setLoadingState({
        watchlist: false,
        favorites: false,
        initialLoading: false,
      });
    }
  }, [user, showId, isInLibrary, dropDownMenu]);

  const handleLibraryClick = async (library: LibraryType) => {
    const libraryName =
      library === "watchlist"
        ? t("Watchlist.WatchlistName")
        : t("Favourites.FavoritesName");

    if (!user || !showId || !theShow) {
      return toast.error(`${t("Toasts.NeedsLogin")} ${libraryName}`, {
        description: (
          <Link href="/auth/login" className="underline text-blue-500">
            {t("Toasts.LoginHere")}
          </Link>
        ),
      });
    }

    const isInLibraryState = libraryState[library];

    try {
      setLoadingState((prev) => ({ ...prev, [library]: true }));

      if (isInLibraryState) {
        // REMOVE
        await removeFromLibrary({ userId: user.uid, showId, library });
        setLibraryState((prevState) => ({ ...prevState, [library]: false }));

        const formattedShow =
          "showType" in theShow
            ? (theShow as FirestoreTheShowI)
            : updatedTheShow(theShow);

        dispatch(
          library === "watchlist"
            ? removeFromWatchlist(formattedShow)
            : removeFromFavorites(formattedShow),
        );

        toast.success(` ${t("Toasts.RemovedFrom")} ${libraryName}`);
      } else {
        let arTitle = "";
        let arOverview = "";
        if (library === "watchlist") {
          // const show = (await getMTDetails({ showId, showType }).unwrap()) as
          //   | MovieDetailsResponse
          //   | TvDetailsResponse;
          const { data: tmdbTranslations } = await getTranslations(
            {
              showId,
              showType,
            },
            true,
          );
          const tmdbArSaOverview = tmdbTranslations?.translations
            ?.find((t) => t.iso_639_1 === "ar" && t.iso_3166_1 === "SA")
            ?.data?.overview?.trim();
          const tmdbArAeOverview = tmdbTranslations?.translations
            ?.find((t) => t.iso_639_1 === "ar" && t.iso_3166_1 === "AE")
            ?.data?.overview?.trim();
          const tmdbArOverview = tmdbArSaOverview || tmdbArAeOverview;
          if (tmdbArOverview) {
            arOverview = tmdbArOverview;
            if (
              ("original_title" in theShow || "first_air_date" in theShow) &&
              theShow.original_language === "ar"
            ) {
              arTitle =
                (theShow as MovieDetailsResponse | Movie).original_title ||
                (theShow as TvDetailsResponse | TVShow).original_name;
            }
          } else {
            const overview = theShow.overview || "";

            const { data } = await translate({
              overview,
            });

            arTitle =
              data?.translatedTitle ??
              ("oriTitle" in theShow
                ? theShow.oriTitle
                : "first_air_date" in theShow
                  ? theShow.original_name
                  : theShow.original_title || "");

            arOverview = data?.translatedOverview || "";
          }
        }
        const updatedShow =
          "showType" in theShow
            ? { ...theShow, arTitle, arOverview }
            : updatedTheShow(theShow, { data: { arTitle, arOverview } });

        await addToLibrary({
          userId: user.uid,
          library,
          theShow: updatedShow,
        });

        setLibraryState((prevState) => ({ ...prevState, [library]: true }));

        dispatch(
          library === "watchlist"
            ? addToWatchlist(updatedShow)
            : addToFavorites(updatedShow),
        );

        toast.success(` ${t("Toasts.AddedTo")} ${libraryName}`, {
          description: (
            <Link
              href={`/library/${library}`}
              className="underline text-blue-500"
            >
              {t("Toasts.View")} {libraryName}
            </Link>
          ),
        });
      }
    } catch (error) {
      console.error(error);
      toast.error(`Error modifying ${library}`);
    } finally {
      setLoadingState((prev) => ({ ...prev, [library]: false }));
    }
  };

  const handleClearLibrary = async ({
    libraryType,
  }: {
    libraryType: LibraryType;
  }) => {
    if (libraryType === "watchlist") {
      await clearLibrary({
        userId: (user && user?.uid) || "",
        library: "watchlist",
      });
      dispatch(clearWatchlist());
      toast.success(t("Toasts.WatchlistCleared"));
    } else {
      await clearLibrary({
        userId: (user && user?.uid) || "",
        library: "favorites",
      });
      dispatch(clearFavorites());
      toast.success(t("Toasts.FavoritesCleared"));
    }
  };

  return {
    libraryState,
    loadingState,
    handleLibraryClick,
    handleClearLibrary,
    isClearLoading,
    watchlist,
    favorites,
    user,
    getLibrary,
    getLibraryLoading,
    getLibraryFetching,
  };
};

export default useLibrary;
