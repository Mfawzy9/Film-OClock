import { Link } from "@/i18n/navigation";
import {
  useAddToWatchedMutation,
  useLazyIsInWatchedQuery,
  useRemoveFromWatchedMutation,
} from "@/lib/Redux/apiSlices/firestoreSlice";
import { RootState } from "@/lib/Redux/store";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  MovieDetailsResponse,
  TvDetailsResponse,
} from "../interfaces/apiInterfaces/detailsInterfaces";
import { FirestoreTheShowI, updatedTheShow } from "./useLibrary";
import {
  addToWatchedShows,
  removeFromWatchedShows,
} from "@/lib/Redux/localSlices/librarySlice";

const useWatchedList = ({ showId }: { showId?: number }) => {
  const t = useTranslations("Library.WatchedList");
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authReducer);
  const { watchedShows } = useSelector(
    (state: RootState) => state.libraryReducer,
  );
  const [isInWatchedShows, setIsInWatchedShows] = useState(false);

  //isInWatched shows
  const [
    isInWatched,
    { isLoading: isInWatchedLoading, isFetching: isInWatchedFetching },
  ] = useLazyIsInWatchedQuery();
  // add to watched
  const [addToWatchedList, { isLoading: addToWatchedListLoading }] =
    useAddToWatchedMutation();
  // remove from watched
  const [removeFromWatchedList, { isLoading: removeFromWatchedListLoading }] =
    useRemoveFromWatchedMutation();

  useEffect(() => {
    if (user && showId) {
      (async () => {
        const { data: res } = await isInWatched(
          { showId, userId: user.uid },
          true,
        );
        if (res) {
          setIsInWatchedShows(true);
        }
      })();
    } else {
      setIsInWatchedShows(false);
    }
  }, [isInWatched, user, showId]);

  const handleClick = async ({
    showName,
    showId,
    theShow,
  }: {
    showName: string;
    showId: number;
    theShow: MovieDetailsResponse | TvDetailsResponse | FirestoreTheShowI;
  }) => {
    if (!user) {
      return toast.error(t("Toasts.NeedsLogin", { title: showName }), {
        description: (
          <Link href="/auth/login" className="underline text-blue-500">
            {t("Toasts.LoginHere")}
          </Link>
        ),
      });
    }

    const { data: isInWatchedShows } = await isInWatched({
      showId,
      userId: user.uid,
    });

    if (isInWatchedShows) {
      const formattedShow =
        "showType" in theShow
          ? (theShow as FirestoreTheShowI)
          : updatedTheShow(theShow);
      await removeFromWatchedList({ userId: user.uid, showId });
      dispatch(removeFromWatchedShows(formattedShow));
      setIsInWatchedShows(false);
      toast.success(t("Toasts.RemovedFromWatchedList", { title: showName }));
    } else {
      const watchedAtDate = new Date().toLocaleDateString();
      const watchedAtTime = new Date().toLocaleTimeString();
      const formattedShow =
        "showType" in theShow
          ? (theShow as FirestoreTheShowI)
          : updatedTheShow(theShow, {}, { watchedAtDate, watchedAtTime });
      await addToWatchedList({
        userId: user.uid,
        theShow: formattedShow,
      });
      dispatch(addToWatchedShows(formattedShow));
      setIsInWatchedShows(true);
      toast.success(t("Toasts.AddedToWatchedList", { title: showName }), {
        description: (
          <Link href={`/watchedShows`} className="underline text-blue-500">
            {t("Toasts.ViewWatchedList")}
          </Link>
        ),
      });
    }
  };

  const isLoading = useMemo(() => {
    return (
      isInWatchedLoading ||
      isInWatchedFetching ||
      addToWatchedListLoading ||
      removeFromWatchedListLoading
    );
  }, [
    isInWatchedLoading,
    isInWatchedFetching,
    addToWatchedListLoading,
    removeFromWatchedListLoading,
  ]);

  return {
    user,
    isInWatchedShows,
    handleClick,
    isLoading,
    watchedShows,
  };
};

export default useWatchedList;
