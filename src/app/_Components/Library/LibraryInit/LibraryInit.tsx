import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetLibraryQuery,
  useGetWatchedQuery,
} from "@/lib/Redux/apiSlices/firestoreSlice";
import {
  setFavorites,
  setWatchedShows,
  setWatchlist,
} from "@/lib/Redux/localSlices/librarySlice";
import { RootState } from "@/lib/Redux/store";

const LibraryInit = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authReducer);

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
    if (user && watchlist && favorites && watchedShows) {
      dispatch(setWatchlist(watchlist));
      dispatch(setFavorites(favorites));
      dispatch(setWatchedShows(watchedShows));
    }
  }, [user, watchlist, favorites, dispatch, watchedShows]);

  return null;
};

export default LibraryInit;
