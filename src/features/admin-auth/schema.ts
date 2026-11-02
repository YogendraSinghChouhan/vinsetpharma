import { z } from "zod";
import { MIN_PASSWORD_LENGTH } from "@/features/auth/constants";

export const passwordSchema = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
  );

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
