import type { UserPrivate } from "./currentUser.schema";
import { requestData } from "./http";

export function getCurrentUser() {
  return requestData<UserPrivate, undefined>("auth/me", { method: "GET" });
}
