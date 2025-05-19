import { configureStore } from "@reduxjs/toolkit";
import { mainApiSlice } from "./tmdbBaseQuery";
import { videoModalReducer } from "./localSlices/videoModalSlice";
import { imgModalReducer } from "./localSlices/imgModalSlice";
import { imgPlaceholderReducer } from "./localSlices/imgPlaceholderSlice";
import { setupListeners } from "@reduxjs/toolkit/query";
import { firestoreApi } from "./apiSlices/firestoreSlice";
import { authReducer } from "./localSlices/authSlice";
import { libraryReducer } from "./localSlices/librarySlice";
import videoDurationSlice from "./apiSlices/videoDurationSlice";
import translationApi from "./apiSlices/translationSlice";
import { homeReducer } from "./localSlices/hasRenderedSlice";

const store = configureStore({
  reducer: {
    [mainApiSlice.reducerPath]: mainApiSlice.reducer,
    videoModalReducer,
    imgModalReducer,
    imgPlaceholderReducer,
    [firestoreApi.reducerPath]: firestoreApi.reducer,
    authReducer,
    libraryReducer,
    [videoDurationSlice.reducerPath]: videoDurationSlice.reducer,
    [translationApi.reducerPath]: translationApi.reducer,
    homeReducer,
  },
  middleware: (getdefaultmiddleware) =>
    getdefaultmiddleware().concat([
      mainApiSlice.middleware,
      firestoreApi.middleware,
      videoDurationSlice.middleware,
      translationApi.middleware,
    ]),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppStore = typeof store;

setupListeners(store.dispatch);
