// import { z } from "zod";

//  export const SignupSchema = z
//   .object({
//     name: z.string().min(2, "Name must be at least 2 characters"),
//     email: z.string().email("Enter a valid email"),
//     password: z.string().min(6, "Password must be at least 6 characters"),
//     cpassword: z.string().min(6, "Please confirm your password"),
//     // recaptchaToken: z.string().min(1, "Recaptcha token is required"),
//   })
//   .refine((data) => data.password === data.cpassword, {
//     message: "Passwords do not match",
//     path: ["cpassword"],
//   });

//  export type SignupFormData = z.infer<typeof SignupSchema>;

// export type SignupFormData = z.infer<typeof signupSchema>;

import { z } from "zod";

/* 1️⃣ Base schema (NO refine, NO captcha) */
export const SignupBaseSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  cpassword: z.string().min(6, "Confirm password is required"),
});

/* 2️⃣ Client schema (password match validation) */
export const SignupSchema = SignupBaseSchema.refine(
  (data) => data.password === data.cpassword,
  {
    message: "Passwords do not match",
    path: ["cpassword"],
  }
);

/* 3️⃣ Server schema (extends BASE, not refined schema) */
export const SignupServerSchema = SignupBaseSchema.extend({
  recaptchaToken: z.string().min(1, "Recaptcha token is required"),
}).refine((data) => data.password === data.cpassword, {
  message: "Passwords do not match",
  path: ["cpassword"],
});

/* Types */
export type SignupFormData = z.infer<typeof SignupSchema>;
export type SignupServerData = z.infer<typeof SignupServerSchema>;
