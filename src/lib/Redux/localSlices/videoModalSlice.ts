import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const baseVideoUrl = "https://www.youtube.com/embed/";

interface videoModalState {
  isOpen: boolean;
  videoSrc: string;
}

const initialState: videoModalState = {
  isOpen: false,
  videoSrc: baseVideoUrl + "",
};

const videoModalSlice = createSlice({
  name: "videoModal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.videoSrc = baseVideoUrl + action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.videoSrc = baseVideoUrl + "";
    },
    toggleModal: (state, action: PayloadAction<string>) => {
      state.isOpen = !state.isOpen;
      state.videoSrc = state.isOpen
        ? baseVideoUrl + action.payload
        : baseVideoUrl + "";
    },
  },
});

export const { openModal, closeModal, toggleModal } = videoModalSlice.actions;
export const videoModalReducer = videoModalSlice.reducer;
