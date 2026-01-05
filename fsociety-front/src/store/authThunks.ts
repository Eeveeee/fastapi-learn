import type { AppDispatch, RootState } from ".";
import { getCurrentUser } from "../api/currentUser.api";
import { API_URL } from "../constants/api";

import {
  setAccessToken,
  setIsAuthorized,
  clearAccessToken,
  setCurrentUser,
  setInitStatus,
} from "./authSlice";

export const getAndSetAccessToken = () => async (dispatch: AppDispatch) => {
  const res = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    dispatch(clearAccessToken());
    dispatch(setIsAuthorized(false));
    return;
  }

  const parsed = await res.json();
  const token = parsed?.access_token;

  if (typeof token !== "string" || !token) {
    dispatch(clearAccessToken());
    throw new Error("UNEXPECTED ANSWER FROM SERVER: NO TOKEN");
  }

  dispatch(setAccessToken(token));
  dispatch(setIsAuthorized(true));

  return token;
};

export const initCurrentUser = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  const { initStatus } = getState().auth;
  // concurrent shit guard
  if (initStatus === "loading" || initStatus === "succeeded") return;

  dispatch(setInitStatus("loading"));
  try {
    const user = await getCurrentUser();
    if (!user) return;
    dispatch(setCurrentUser(user));
    dispatch(setInitStatus("succeeded"));
  } catch (e) {
    dispatch(setInitStatus("failed"));
    throw e;
  }
};
