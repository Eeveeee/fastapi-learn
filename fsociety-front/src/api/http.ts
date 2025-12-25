import { API_URL } from "../constants/api";
import { store } from "../store";
import { clearAccessToken, setAccessToken } from "../store/authSlice";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
// TODO:  FUNCTIONS TO UTILS
async function getFetchResult<TResult>(r: Response): Promise<TResult> {
  if (r.status === 204) {
    return undefined as TResult;
  }
  const contentType = r.headers.get("content-type") ?? "";
  const hasJson = contentType.includes("application/json");
  if (hasJson) {
    return r.json() as Promise<TResult>;
  }

  return (await r.text()) as unknown as TResult;
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
  opts: RequestDataOptions<TBody>,
): Promise<TResult> {
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

  const res = await fetch(`${API_URL}/${url}`, fetchInit);
  if (res.ok) {
    const handledResult = await getFetchResult<TResult>(res);
    return handledResult;
  }

  if (res.status === 401) {
    const refreshRes = await fetch(`${API_URL}/auth/refresh`, { method: "POST" });

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      store.dispatch(setAccessToken(refreshData.access_token));
      appendAuthToRequest(fetchInit);

      const secondTry = await fetch(`${API_URL}/${url}`, fetchInit);

      if (!secondTry.ok) throw new Error("TOKEN MISSMATCH");

      const handledResult = await getFetchResult<TResult>(res);

      return handledResult;
    }
    store.dispatch(clearAccessToken());
    window.localStorage.clear();
    window.sessionStorage.clear();
    throw new Error("TOKEN ROTTEN");
  }

  throw new Error("UNEXPECTED SERVER BEHAVIOR");
}
