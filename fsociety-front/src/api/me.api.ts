import { requestData } from "./http";

export function getCurrentUser() {
  return requestData("auth/me", { method: "GET" });
}
