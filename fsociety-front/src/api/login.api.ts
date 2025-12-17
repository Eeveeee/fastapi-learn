import { requestData } from "./http";
import type { LoginSchema } from "./login.schema";

export function login(payload: LoginSchema) {
  return requestData("login", { method: "POST", body: payload });
}
