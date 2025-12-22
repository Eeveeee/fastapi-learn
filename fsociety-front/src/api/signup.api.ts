import { requestData } from "./http";
import type { SignUpSchema } from "./signup.schema";

export function signUp(payload: SignUpSchema) {
  return requestData("register", { method: "POST", body: payload });
}
