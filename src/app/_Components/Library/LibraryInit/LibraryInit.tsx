import { useEffect, useRef } from "react";
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
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
    },
  );

  const { data: watchlist } = useGetLibraryQuery(
    { library: "watchlist", userId: user?.uid || "" },
    {
      skip: !user?.uid,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
    },
  );

  const { data: favorites } = useGetLibraryQuery(
    { library: "favorites", userId: user?.uid || "" },
    {
      skip: !user?.uid,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
    },
  );

  const hasSynced = useRef(false);

  useEffect(() => {
    if (!hasSynced.current && user && watchlist && favorites && watchedShows) {
      dispatch(setWatchlist(watchlist));
      dispatch(setFavorites(favorites));
      dispatch(setWatchedShows(watchedShows));
      hasSynced.current = true; // prevent re-running
    }
  }, [user, watchlist, favorites, dispatch, watchedShows]);

  return null;
};

export default LibraryInit;
