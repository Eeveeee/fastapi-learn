import type { User } from "../types/user.type";
import { requestData } from "./http";
import type { CreateUser } from "./users.schema";

export function createUser(payload: CreateUser) {
  return requestData("users", { method: "POST", body: payload });
}
export function getUsers() {
  return requestData<User, undefined>("users", {});
}
