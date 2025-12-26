import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserPrivate } from "../api/currentUser.schema";

export type InitStatus = "idle" | "loading" | "succeeded" | "failed";
type AuthState = {
  accessToken?: string;
  isAuthorized: boolean;
  currentUser?: UserPrivate;
  initStatus: InitStatus;
};

const initialState: AuthState = {
  isAuthorized: false,
  accessToken: undefined,
  currentUser: undefined,
  initStatus: "idle",
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setIsAuthorized(state, action: PayloadAction<boolean>) {
      state.isAuthorized = action.payload;
    },

    setInitStatus(state, action: PayloadAction<InitStatus>) {
      state.initStatus = action.payload;
    },

    setCurrentUser(state, action: PayloadAction<UserPrivate>) {
      state.currentUser = action.payload;
    },

    clearCurrentUser(state) {
      state.currentUser = undefined;
    },

    setAccessToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload;
    },

    clearAccessToken(state) {
      state.accessToken = undefined;
    },
  },
});

export const {
  setIsAuthorized,
  setAccessToken,
  clearAccessToken,
  setCurrentUser,
  setInitStatus,
  clearCurrentUser,
} = authSlice.actions;
export default authSlice.reducer;
