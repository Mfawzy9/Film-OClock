import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImgPlaceholderState {
  loadedImgs: { [key: string]: boolean };
}

const initialState: ImgPlaceholderState = {
  loadedImgs: {},
};

const imgPlaceholderSlice = createSlice({
  name: "imgPlaceholder",
  initialState,
  reducers: {
    setImageLoaded: (state, action: PayloadAction<string>) => {
      if (!state.loadedImgs[action.payload]) {
        state.loadedImgs[action.payload] = true;
      }
    },
  },
});

export const { setImageLoaded } = imgPlaceholderSlice.actions;
export const imgPlaceholderReducer = imgPlaceholderSlice.reducer;
