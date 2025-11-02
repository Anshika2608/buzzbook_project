"use server";

import { SignupSchema, SignupFormData } from "@/lib/validation/SignUpschema";
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
    const { name, email, password, cpassword, recaptchaToken } = formData;

    console.log("📡 Sending POST to:", route.register);

    // ✅ Register user
    const res = await axios.post(
      route.register,
      { name, email, password, cpassword, recaptchaToken },
      { withCredentials: true }
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

    // ✅ Auto login after successful registration
    const loginRes = await axios.post(
      route.login,
      { email, password, recaptchaToken },
      { withCredentials: true }
    );

    const { accessToken, user } = loginRes.data;

    // ✅ store access token
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }

    return {
      success: true,
      user,
      accessToken,
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
