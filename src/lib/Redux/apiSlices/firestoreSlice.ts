import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

import { FirestoreTheShowI } from "@/app/hooks/useLibrary";

type LibraryType = "watchlist" | "favorites";
type TheShowType = FirestoreTheShowI;

interface SuccessResponse {
  success: true;
  message?: string;
  count?: number;
}

interface ErrorResponse {
  error: {
    message: string;
    code?: string;
  };
}

export const firestoreApi = createApi({
  reducerPath: "firestoreApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Watchlist", "Favorites", "WatchlistItem"],
  endpoints: (builder) => ({
    // --- GET WATCHLIST / FAVORITES ---
    getLibrary: builder.query<
      TheShowType[],
      { userId: string; library: LibraryType }
    >({
      async queryFn({ userId, library }) {
        try {
          const querySnapshot = await getDocs(
            collection(db, "users", userId, library),
          );
          const data = querySnapshot.docs.map((docSnap) => ({
            ...docSnap.data(),
            id: Number(docSnap.id),
          })) as TheShowType[];

          return { data };
        } catch (error) {
          return {
            error: {
              message: error instanceof Error ? error.message : "Unknown error",
              code: (error as any)?.code,
            },
          };
        }
      },
      providesTags: (result, error, { userId, library }) => [
        {
          type: library === "watchlist" ? "Watchlist" : "Favorites",
          id: userId,
        },
      ],
    }),

    // --- ADD TO WATCHLIST / FAVORITES ---
    addToLibrary: builder.mutation<
      SuccessResponse | ErrorResponse,
      { userId: string; theShow: TheShowType; library: LibraryType }
    >({
      async queryFn({ userId, theShow, library }) {
        try {
          const showId = theShow.id.toString();
          await setDoc(doc(db, "users", userId, library, showId), theShow);
          return {
            data: {
              success: true,
              message: "Item added successfully",
            },
          };
        } catch (error) {
          return {
            error: {
              message: error instanceof Error ? error.message : "Unknown error",
              code: (error as any)?.code,
            },
          };
        }
      },
      invalidatesTags: (result, error, { userId, library }) => [
        {
          type: library === "watchlist" ? "Watchlist" : "Favorites",
          id: userId,
        },
      ],
    }),

    // --- REMOVE FROM WATCHLIST / FAVORITES ---
    removeFromLibrary: builder.mutation<
      SuccessResponse | ErrorResponse,
      { userId: string; showId: number; library: LibraryType }
    >({
      async queryFn({ userId, showId, library }) {
        try {
          await deleteDoc(doc(db, "users", userId, library, showId.toString()));
          return {
            data: {
              success: true,
              message: "Item removed successfully",
            },
          };
        } catch (error) {
          return {
            error: {
              message: error instanceof Error ? error.message : "Unknown error",
              code: (error as any)?.code,
            },
          };
        }
      },
      invalidatesTags: (result, error, { userId, library }) => [
        {
          type: library === "watchlist" ? "Watchlist" : "Favorites",
          id: userId,
        },
      ],
    }),

    // --- CLEAR ENTIRE WATCHLIST / FAVORITES ---
    clearLibrary: builder.mutation<
      (SuccessResponse | ErrorResponse) & { count: number },
      { userId: string; library: LibraryType }
    >({
      async queryFn({ userId, library }) {
        try {
          const querySnapshot = await getDocs(
            collection(db, "users", userId, library),
          );

          const deletePromises = querySnapshot.docs.map((docSnap) =>
            deleteDoc(doc(db, "users", userId, library, docSnap.id)),
          );

          await Promise.all(deletePromises);
          return {
            data: {
              success: true,
              count: querySnapshot.size,
              message: `Cleared ${querySnapshot.size} items`,
            },
          };
        } catch (error) {
          return {
            error: {
              message: error instanceof Error ? error.message : "Unknown error",
              code: (error as any)?.code,
            },
          };
        }
      },
      invalidatesTags: (result, error, { userId, library }) => [
        {
          type: library === "watchlist" ? "Watchlist" : "Favorites",
          id: userId,
        },
      ],
    }),

    // --- CHECK IF ITEM EXISTS IN WATCHLIST / FAVORITES ---
    isInLibrary: builder.query<
      boolean,
      { userId: string; showId: number; library: LibraryType }
    >({
      async queryFn({ userId, showId, library }) {
        try {
          const docRef = doc(db, "users", userId, library, String(showId));
          const docSnap = await getDoc(docRef);
          return { data: docSnap.exists() };
        } catch (error) {
          return {
            error: {
              message: error instanceof Error ? error.message : "Unknown error",
              code: (error as any)?.code,
            },
          };
        }
      },
      providesTags: (result, error, { userId, showId, library }) => [
        {
          type: library === "watchlist" ? "Watchlist" : "Favorites",
          id: `${userId}-${showId}`,
        },
      ],
    }),
    markAsWatchedStatus: builder.mutation<
      SuccessResponse | ErrorResponse,
      { userId: string; showId: number; isWatched: boolean }
    >({
      async queryFn({ userId, showId, isWatched }) {
        try {
          await updateDoc(
            doc(db, "users", userId, "watchlist", String(showId)),
            { isWatched },
          );
          return {
            data: {
              success: true,
              message: `Marked as ${isWatched ? "watched" : "unwatched"} successfully`,
            },
          };
        } catch (error) {
          return {
            error: {
              message: error instanceof Error ? error.message : "Unknown error",
              code: (error as any)?.code,
            },
          };
        }
      },
      invalidatesTags: (result, error, { userId, showId }) => [
        { type: "Watchlist", id: userId }, // Invalidate entire watchlist
        { type: "WatchlistItem", id: `${userId}-${showId}` }, // Invalidate specific item
      ],
    }),
  }),
});

export const {
  useGetLibraryQuery,
  useAddToLibraryMutation,
  useRemoveFromLibraryMutation,
  useClearLibraryMutation,
  useIsInLibraryQuery,
  useLazyGetLibraryQuery,
  useLazyIsInLibraryQuery,
  useMarkAsWatchedStatusMutation,
} = firestoreApi;
