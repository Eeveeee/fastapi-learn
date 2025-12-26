export async function getFetchResult<TResult>(r: Response): Promise<TResult> {
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
