import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetLibraryQuery } from "@/lib/Redux/apiSlices/firestoreSlice";
import {
  setFavorites,
  setWatchlist,
} from "@/lib/Redux/localSlices/librarySlice";
import { RootState } from "@/lib/Redux/store";

const LibraryInit = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authReducer);

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
    if (!hasSynced.current && user && watchlist && favorites) {
      dispatch(setWatchlist(watchlist));
      dispatch(setFavorites(favorites));
      hasSynced.current = true; // prevent re-running
    }
  }, [user, watchlist, favorites, dispatch]);

  return null;
};

export default LibraryInit;
