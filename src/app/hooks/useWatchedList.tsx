import { Link } from "@/i18n/navigation";
import {
  useAddToWatchedMutation,
  useRemoveFromWatchedMutation,
} from "@/lib/Redux/apiSlices/firestoreSlice";
import { RootState } from "@/lib/Redux/store";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
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
  setLibraryLoading,
} from "@/lib/Redux/localSlices/librarySlice";

const useWatchedList = ({ showId }: { showId?: number }) => {
  const t = useTranslations("Library.WatchedList");
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.authReducer);
  const { watchedShows, watchedShowsLoading } = useSelector(
    (state: RootState) => state.libraryReducer,
  );

  const [addToWatchedList, { isLoading: addToWatchedListLoading }] =
    useAddToWatchedMutation();
  // remove from watched
  const [removeFromWatchedList, { isLoading: removeFromWatchedListLoading }] =
    useRemoveFromWatchedMutation();

  const isInWatchedShows = useMemo(
    () =>
      watchedShows.some((show) => show.id.toString() === showId?.toString()),
    [watchedShows, showId],
  );

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

    const isInWatched = watchedShows.some(
      (show) => show.id.toString() === showId.toString(),
    );

    try {
      if (isInWatched) {
        const formattedShow =
          "showType" in theShow
            ? (theShow as FirestoreTheShowI)
            : updatedTheShow(theShow);
        await removeFromWatchedList({ userId: user.uid, showId });
        dispatch(removeFromWatchedShows(formattedShow));
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
        toast.success(t("Toasts.AddedToWatchedList", { title: showName }), {
          description: (
            <Link href={`/watchedShows`} className="underline text-blue-500">
              {t("Toasts.ViewWatchedList")}
            </Link>
          ),
        });
      }
    } catch (error) {
      console.error("Error updating watched list:", error);
      toast.error(t("Toasts.NoDocumentToUpdate", { title: showName }));
    } finally {
      dispatch(setLibraryLoading({ type: "watchedShows", loading: false }));
    }
  };

  const isLoading = useMemo(() => {
    return (
      watchedShowsLoading ||
      addToWatchedListLoading ||
      removeFromWatchedListLoading
    );
  }, [
    watchedShowsLoading,
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
