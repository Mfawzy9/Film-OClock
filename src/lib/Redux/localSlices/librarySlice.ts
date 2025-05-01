import { FirestoreTheShowI } from "@/app/hooks/useLibrary";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type LibraryState = {
  watchlist: FirestoreTheShowI[];
  favorites: FirestoreTheShowI[];
};

const initialState: LibraryState = {
  watchlist: [],
  favorites: [],
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
    addToWatchlist: (state, action: PayloadAction<FirestoreTheShowI>) => {
      state.watchlist.push(action.payload);
    },
    addToFavorites: (state, action: PayloadAction<FirestoreTheShowI>) => {
      state.favorites.push(action.payload);
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
    clearWatchlist: (state) => {
      state.watchlist = [];
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const {
  setWatchlist,
  setFavorites,
  addToWatchlist,
  addToFavorites,
  removeFromWatchlist,
  removeFromFavorites,
  clearWatchlist,
  clearFavorites,
} = librarySlice.actions;

export const libraryReducer = librarySlice.reducer;
