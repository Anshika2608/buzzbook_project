"use server";

import { SignupSchema,SignupFormData } from "@/lib/validation/SignUpschema";
import { route } from "@/lib/api";
import axios from "axios";

export default async function register(formData: SignupFormData) {
  const validationResult = SignupSchema.safeParse(formData);

  if (!validationResult.success) {
    const fieldErrors: Record<string, string> = {};
    validationResult.error.errors.forEach((error) => {
      fieldErrors[error.path[0]] = error.message;
    });
    return {
      success: false,
      fieldErrors,
    };
  }

  try {
    const { name, email, password,cpassword, recaptchaToken } = formData;

    const { data, status } = await axios.post(route.register, {
  name,
  email,
  password,
  cpassword,
  recaptchaToken,
    });
console.log("📡 Sending POST to:", route.register);
    if (status === 201) {
      return { success: true, data };
    } else {
      return {
        success: false,
        error: {
          message: data.message || "Registration failed",
          description: data.error || "Unknown server error",
          status,
        },
      };
    }
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error?.response?.data?.message || "Something went wrong",
        description: error?.response?.data?.error || error.message,
        status: error?.response?.status || 500,
      },
    };
  }
}
