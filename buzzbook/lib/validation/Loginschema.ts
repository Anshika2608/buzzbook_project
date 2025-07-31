import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  recaptchaToken: z.string().min(1, { message: "reCAPTCHA is required" }),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
