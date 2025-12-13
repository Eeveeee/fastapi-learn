import { API_URL } from "../constants/api";

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface requestDataOptions<TBody> {
  method?: HttpMethod;
  body?: TBody;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export async function requestData<TResult, TBody>(
  url: string,
  opts: requestDataOptions<TBody>,
): Promise<TResult> {
  const res = await fetch(`${API_URL}/${url}`, {
    method: opts.method ?? "GET",
    headers: {
      ...(opts.body ? { "Content-Type": "application/json" } : {}),
      ...(opts.headers ?? {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    signal: opts.signal,
    //credentials: "include",
  });
  // 204 No Content и прочие без тела
  const contentType = res.headers.get("content-type") ?? "";
  const hasJson = contentType.includes("application/json");

  if (!res.ok) {
    let body: unknown = undefined;
    if (hasJson) {
      try {
        body = await res.json();
      } catch {
        // ignore
      }
    }

    console.error(`HTTP ${res.status} for ${url}`, res.status, body);
  }

  if (res.status === 204) {
    return undefined as TResult;
  }

  if (hasJson) {
    return res.json() as Promise<TResult>;
  }

  // если вдруг сервер вернул текст
  return (await res.text()) as unknown as TResult;
}
