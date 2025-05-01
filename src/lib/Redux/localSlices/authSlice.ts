import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  [x: string]: any;
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  photoURL: string | null;
  accessToken: string;
  phoneNumber: string | null;
  creationTime: string | null;
  lastSignInTime: string | null;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isGoogleLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  isGoogleLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthState["user"] | null>) => {
      state.user = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setGoogleLoading: (state, action: PayloadAction<boolean>) => {
      state.isGoogleLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const { setUser, setLoading, setGoogleLoading, setError, logout } =
  authSlice.actions;
export const authReducer = authSlice.reducer;
