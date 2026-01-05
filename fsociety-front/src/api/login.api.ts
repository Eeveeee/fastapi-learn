import { requestData } from "./http";
import type { LoginSchema } from "./login.schema";

export async function login(payload: LoginSchema) {
  return requestData("auth/login", { method: "POST", body: payload });
}
