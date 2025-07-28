import { z } from "zod";

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof ResetPasswordSchema>;
