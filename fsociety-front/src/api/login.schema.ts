import { z } from "zod";

export const loginSchema = z.object({
  password: z.string().min(8).max(16),
  username: z.string().min(3, "Min 3 chars").max(16),
});

export type LoginSchema = z.infer<typeof loginSchema>;
