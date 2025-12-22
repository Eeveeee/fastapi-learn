import { z } from "zod";

export const signUpUserSchema = z.object({
  password: z.string().min(8).max(16),
  first_name: z.string().min(1, "Required"),
  last_name: z.string().min(1, "Required"),
  username: z.string().min(3, "Min 3 chars"),
  email: z.email(),
  gender: z.enum(["male", "female"]),
});

export type SignUpSchema = z.infer<typeof signUpUserSchema>;
