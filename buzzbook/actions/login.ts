import { LoginSchema, LoginFormData } from "@/lib/validation/Loginschema";
import { route } from "@/lib/api";
import axios from "axios";
import api from "@/lib/interceptor";
export default async function login(formData: LoginFormData) {
  const validationResult = LoginSchema.safeParse(formData);
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
    const { email, password, recaptchaToken } = formData;
    const response = await api.post(
      route.login,
      { email, password, recaptchaToken },
      { withCredentials: true }
    );

    const { data, status } = response;

    if (status === 200 || status === 201) {
      const { accessToken, user } = data;

      return {
        success: true,
        user,
        accessToken,
      };
    }

    return {
      success: false,
      error: {
        message: data.message || "Login failed",
        description: data.error || "Unexpected server response",
        status,
      },
    };
  } catch (error: any) {
    console.error("Login API error:", error);

    let message = "Something went wrong";
    let description = "";
    let status = 500;

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message || message;
      description = error.response?.data?.error || error.message;
      status = error.response?.status || status;
    } else if (error instanceof Error) {
      description = error.message;
    }

    return {
      success: false,
      error: {
        message,
        description,
        status,
      },
    };
  }
}


