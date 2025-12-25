import { requestData } from "./http";
import type { SignUpSchema } from "./signup.schema";

export function signUp(payload: SignUpSchema) {
  return requestData("auth/signup", { method: "POST", body: payload });
}
