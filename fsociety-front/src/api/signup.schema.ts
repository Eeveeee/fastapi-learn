import { z } from "zod";

export const signUpUserSchema = z.object({
  password: z.string().min(8).max(16),
  username: z.string().min(3, "Min 3 chars").max(16),
  email: z.email().max(48),
});

export type SignUpSchema = z.infer<typeof signUpUserSchema>;
