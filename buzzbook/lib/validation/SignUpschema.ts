import { z } from "zod";

 export const SignupSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    cpassword: z.string().min(6, "Please confirm your password"),
    recaptchaToken: z.string().min(1, "Recaptcha token is required"),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords do not match",
    path: ["cpassword"],
  });

 export type SignupFormData = z.infer<typeof SignupSchema>;

// export type SignupFormData = z.infer<typeof signupSchema>;