import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  collection,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";

import { FirestoreTheShowI } from "@/app/hooks/useLibrary";
import { deleteUser, User } from "firebase/auth";

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
  tagTypes: ["Watchlist", "Favorites", "WatchedShows"],
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
      providesTags: (result, error, { userId, library }) => [
        {
          type: library === "watchlist" ? "Watchlist" : "Favorites",
          id: userId,
        },
      ],
    }),
    // --- get watched list ---
    getWatched: builder.query<TheShowType[], { userId: string }>({
      async queryFn({ userId }) {
        try {
          const querySnapshot = await getDocs(
            collection(db, "users", userId, "watched"),
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
      providesTags: (result, error, { userId }) => [
        { type: "WatchedShows", id: userId },
      ],
    }),

    // --- Add to watched list ---
    addToWatched: builder.mutation<
      SuccessResponse | ErrorResponse,
      { userId: string; theShow: TheShowType }
    >({
      async queryFn({ userId, theShow }) {
        try {
          await setDoc(
            doc(db, "users", userId, "watched", String(theShow.id)),
            theShow,
          );
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
      invalidatesTags: (result, error, { userId }) => [
        { type: "WatchedShows", id: userId },
      ],
    }),
    // --- remove from watched list ---
    removeFromWatched: builder.mutation<
      SuccessResponse | ErrorResponse,
      { userId: string; showId: number }
    >({
      async queryFn({ userId, showId }) {
        try {
          await deleteDoc(doc(db, "users", userId, "watched", String(showId)));
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
      invalidatesTags: (result, error, { userId }) => [
        { type: "WatchedShows", id: userId },
      ],
    }),
    //--- check if item exists in watched list ---
    isInWatched: builder.query<boolean, { userId: string; showId: number }>({
      async queryFn({ userId, showId }) {
        try {
          const docRef = doc(db, "users", userId, "watched", String(showId));
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
      providesTags: (result, error, { userId }) => [
        { type: "WatchedShows", id: userId },
      ],
    }),
    // --- delete user ---
    deleteUserDataFromDatabase: builder.mutation<
      SuccessResponse | ErrorResponse,
      { userId: string; user: User }
    >({
      async queryFn({ userId, user }) {
        const subcollections = ["watchlist", "favorites", "watched"];

        try {
          // 1. Delete all subcollection docs
          await Promise.all(
            subcollections.map(async (name) => {
              const snapshot = await getDocs(
                collection(db, "users", userId, name),
              );
              await Promise.all(snapshot.docs.map((doc) => deleteDoc(doc.ref)));
            }),
          );

          // 2. Delete the main user document
          await deleteDoc(doc(db, "users", userId));

          // 3. Delete the user from firebase auth
          await deleteUser(user);

          return {
            data: {
              success: true,
              message: "User deleted successfully",
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
      invalidatesTags: (result, error, { userId }) => [
        { type: "Watchlist", id: userId },
        { type: "WatchedShows", id: userId },
        { type: "Favorites", id: userId },
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

  useGetWatchedQuery,
  useAddToWatchedMutation,
  useRemoveFromWatchedMutation,
  useIsInWatchedQuery,
  useLazyIsInWatchedQuery,

  useDeleteUserDataFromDatabaseMutation,
} = firestoreApi;

export default firestoreApi;
