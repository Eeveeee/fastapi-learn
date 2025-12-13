import { z } from "zod";

export const createUserSchema = z.object({
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  username: z.string().min(3, "Min 3 chars"),
  email: z.email(),
  gender: z.enum(["male", "female"]),
});

export type CreateUser = z.infer<typeof createUserSchema>;
