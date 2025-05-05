import { FirestoreTheShowI } from "@/app/hooks/useLibrary";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LibraryState = {
  watchlist: FirestoreTheShowI[];
  favorites: FirestoreTheShowI[];
  watchedShows: FirestoreTheShowI[];
};

const initialState: LibraryState = {
  watchlist: [],
  favorites: [],
  watchedShows: [],
};

const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    setWatchlist: (state, action: PayloadAction<FirestoreTheShowI[]>) => {
      state.watchlist = action.payload;
    },
    setFavorites: (state, action: PayloadAction<FirestoreTheShowI[]>) => {
      state.favorites = action.payload;
    },
    setWatchedShows: (state, action: PayloadAction<FirestoreTheShowI[]>) => {
      state.watchedShows = action.payload;
    },
    addToWatchlist: (state, action: PayloadAction<FirestoreTheShowI>) => {
      state.watchlist.push(action.payload);
    },
    addToFavorites: (state, action: PayloadAction<FirestoreTheShowI>) => {
      state.favorites.push(action.payload);
    },
    addToWatchedShows: (state, action: PayloadAction<FirestoreTheShowI>) => {
      state.watchedShows.push(action.payload);
    },
    removeFromWatchlist: (state, action: PayloadAction<FirestoreTheShowI>) => {
      state.watchlist = state.watchlist.filter(
        (item) => item.id !== action.payload.id,
      );
    },
    removeFromFavorites: (state, action: PayloadAction<FirestoreTheShowI>) => {
      state.favorites = state.favorites.filter(
        (item) => item.id !== action.payload.id,
      );
    },
    removeFromWatchedShows: (
      state,
      action: PayloadAction<FirestoreTheShowI>,
    ) => {
      state.watchedShows = state.watchedShows.filter(
        (item) => item.id !== action.payload.id,
      );
    },
    clearWatchlist: (state) => {
      state.watchlist = [];
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
    clearWatchedShows: (state) => {
      state.watchedShows = [];
    },
  },
});

export const {
  setWatchlist,
  setFavorites,
  setWatchedShows,
  addToWatchlist,
  addToFavorites,
  addToWatchedShows,
  removeFromWatchlist,
  removeFromFavorites,
  removeFromWatchedShows,
  clearWatchlist,
  clearFavorites,
  clearWatchedShows,
} = librarySlice.actions;

export const libraryReducer = librarySlice.reducer;
