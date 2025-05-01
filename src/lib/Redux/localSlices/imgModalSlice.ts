import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ImageModalState {
  isOpen: boolean;
  images: string[];
  selectedIndex: number | null;
}

const initialState: ImageModalState = {
  isOpen: false,
  images: [],
  selectedIndex: null,
};

const imageModalSlice = createSlice({
  name: "imgModal",
  initialState,
  reducers: {
    openImgModal: (
      state,
      action: PayloadAction<{ images: string[]; index: number }>,
    ) => {
      state.isOpen = true;
      state.images = action.payload.images;
      state.selectedIndex = action.payload.index;
      document.body.style.overflow = "hidden";
    },
    closeImgModal: (state) => {
      state.isOpen = false;
      document.body.style.removeProperty("overflow");
    },
    nextImage: (state) => {
      if (state.selectedIndex === null || state.images.length === 0) return;

      state.selectedIndex = (state.selectedIndex + 1) % state.images.length;
    },
    prevImage: (state) => {
      if (state.selectedIndex === null || state.images.length === 0) return;
      state.selectedIndex =
        (state.selectedIndex - 1 + state.images.length) % state.images.length;
    },
  },
});

export const { openImgModal, closeImgModal, nextImage, prevImage } =
  imageModalSlice.actions;
export const imgModalReducer = imageModalSlice.reducer;
