import { API_URL } from "../constants/api";
import { store } from "../store";
import { clearAccessToken, setInitStatus, setIsAuthorized } from "../store/authSlice";
import { getAndSetAccessToken } from "../store/authThunks";
import { getFetchResult } from "../utils/getFetchResult";
import type { ResponseDetail, ResponseError } from "./http.types";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function Logout() {
  store.dispatch(clearAccessToken());
  window.localStorage.clear();
  window.sessionStorage.clear();
  store.dispatch(setIsAuthorized(false));
  store.dispatch(setInitStatus("failed"));
}

//TODO: auth bearer not setting
function appendAuthToRequest(request: RequestInit) {
  const state = store.getState();
  const accessToken = state.auth.accessToken;
  const headers = new Headers(request.headers);
  console.log("TOKEN: ", accessToken);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  request.headers = headers;
  console.log("APPENDING: ", accessToken);
  console.log("REQUEST", request);
  return request;
}
type RequestDataOptions<TBody> = {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

export async function requestData<TResult, TBody>(
  url: string,
  opts: RequestDataOptions<TBody> = {},
): Promise<TResult | undefined> {
  const fetchInit = {
    method: opts.method ?? "GET",
    headers: {
      ...(opts.body ? { "Content-Type": "application/json" } : {}),
      ...(opts.headers ?? {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
    credentials: "include" as const,
  };

  appendAuthToRequest(fetchInit);

  const response = await fetch(`${API_URL}/${url}`, fetchInit);
  const handledResult = await getFetchResult<TResult>(response);
  if (response.ok) {
    return handledResult;
  }

  if (response.status === 401) {
    const token = await store.dispatch(getAndSetAccessToken());

    if (token) {
      appendAuthToRequest(fetchInit);

      const secondTry = await fetch(`${API_URL}/${url}`, fetchInit);

      if (!secondTry.ok) throw new Error("TOKEN MISSMATCH");

      const handledResult = await getFetchResult<TResult>(secondTry);

      return handledResult;
    }
  }

  Logout();
}
