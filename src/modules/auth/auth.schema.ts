import { z } from "zod";

// Regex untuk meniru validator.isStrongPassword (min 8 char, min 1 uppercase, 1 lowercase, 1 number, 1 symbol)
const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

export const registerBodySchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, { error: "Username must be at least 3 characters" }),

  email: z
    .email()
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .regex(strongPasswordRegex, {
      error: "Password not strong enough",
    }),
});

export const loginBodySchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, { error: "Identifier cannot be empty" }),

  password: z
    .string()
    .min(1, { error: "Password cannot be empty" }),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
