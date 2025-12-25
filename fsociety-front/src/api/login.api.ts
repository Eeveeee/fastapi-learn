import { requestData } from "./http";
import type { LoginSchema } from "./login.schema";

export function login(payload: LoginSchema) {
  return requestData("auth/login", { method: "POST", body: payload });
}
