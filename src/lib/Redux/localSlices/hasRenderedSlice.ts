import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface HomeState {
  hasSliderRendered: boolean;
}

const initialState: HomeState = {
  hasSliderRendered: false,
};

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setSliderRendered(state, action: PayloadAction<boolean>) {
      state.hasSliderRendered = action.payload;
    },
  },
});

export const { setSliderRendered } = homeSlice.actions;
export const homeReducer = homeSlice.reducer;
