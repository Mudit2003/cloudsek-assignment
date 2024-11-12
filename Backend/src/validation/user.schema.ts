import { z } from "zod";

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const emailValidator = z.string().email("Invalid email address");

export const usernameValidator = z
  .string()
  .min(3, "Username must be at least 3 characters long")
  .max(20, "Username must be at most 20 characters long");

export const passwordValidator = z
  .string()
  .min(8, "Password must be at least 8 characters long");
export default userSchema;
