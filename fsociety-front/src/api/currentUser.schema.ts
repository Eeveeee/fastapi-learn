import { z } from "zod";

export const userPrivateSchema = z.object({
  id: z.number().int().positive(),
  username: z.string().min(1),
  email: z.email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  gender: z.enum(["male", "female", "other"]),
  is_active: z.boolean(),
  role: z.string().min(1),
});

export type UserPrivate = z.infer<typeof userPrivateSchema>;
