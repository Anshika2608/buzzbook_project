"use server";

import { SignupServerSchema,SignupServerData, SignupFormData } from "@/lib/validation/SignUpschema";
import { route } from "@/lib/api";
import api from "@/lib/interceptor"

export default async function register(formData: SignupServerData) {
  const validationResult = SignupServerSchema.safeParse(formData);

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
    const { name, email, password, cpassword, recaptchaToken } = formData;

    console.log("📡 Sending POST to:", route.register);

    // ✅ Register user
    const res = await api.post(
      route.register,
      { name, email, password, cpassword, recaptchaToken },
    );

    const { data, status } = res;

    if (status !== 201) {
      return {
        success: false,
        error: {
          message: data.message || "Registration failed",
          description: data.error || "Unknown server error",
          status,
        },
      };
    }

    return {
      success: true,
      message: "User registered & logged in successfully ✅",
    };
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
