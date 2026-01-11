import type { User } from "../types/user.type";
import { requestData } from "./http";
import type { CreateUserSchema } from "./users.schema";

export function createUser(payload: CreateUserSchema) {
  return requestData("users", { method: "POST", body: payload });
}
export function getUsers() {
  return requestData<User[], undefined>("users");
}
export function getUser(id: number) {
  return requestData<User, undefined>(`users/${id}`);
}
