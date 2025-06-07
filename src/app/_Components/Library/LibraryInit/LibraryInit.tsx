import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetLibraryQuery,
  useGetWatchedQuery,
} from "@/lib/Redux/apiSlices/firestoreSlice";
import {
  setFavorites,
  setLibraryLoading,
  setWatchedShows,
  setWatchlist,
} from "@/lib/Redux/localSlices/librarySlice";
import { RootState } from "@/lib/Redux/store";
import { fetchUserCountry } from "../../../../../helpers/userLocation";
import { setIsUserInMiddleEast } from "@/lib/Redux/localSlices/authSlice";

const LibraryInit = () => {
  const dispatch = useDispatch();
  const { user, userStatusLoading } = useSelector(
    (state: RootState) => state.authReducer,
  );

  const { data: watchedShows } = useGetWatchedQuery(
    { userId: user?.uid || "" },
    {
      skip: !user?.uid,
    },
  );

  const { data: watchlist } = useGetLibraryQuery(
    { library: "watchlist", userId: user?.uid || "" },
    {
      skip: !user?.uid,
    },
  );

  const { data: favorites } = useGetLibraryQuery(
    { library: "favorites", userId: user?.uid || "" },
    {
      skip: !user?.uid,
    },
  );

  useEffect(() => {
    fetchUserCountry().then((res) => dispatch(setIsUserInMiddleEast(res)));
  }, [dispatch]);

  useEffect(() => {
    if (userStatusLoading) return;
    if (user && watchlist && favorites && watchedShows) {
      dispatch(setWatchlist(watchlist));
      dispatch(setFavorites(favorites));
      dispatch(setWatchedShows(watchedShows));
      dispatch(setLibraryLoading({ type: "watchlist", loading: false }));
    } else if (!user) {
      dispatch(setLibraryLoading({ type: "watchlist", loading: false }));
    }
  }, [user, watchlist, favorites, dispatch, watchedShows, userStatusLoading]);

  return null;
};

export default LibraryInit;
