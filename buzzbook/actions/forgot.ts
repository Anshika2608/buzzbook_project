"use server";

import { route } from "@/lib/api";
import axios from "axios";
import { ForgotPasswordFormData } from "@/lib/validation/ForgotSchema";

export default async function forgot(
  data: ForgotPasswordFormData
): Promise<
  | { success: true; data: any }
  | {
      success: false;
      error: {
        message: string;
        description?: string;
        status: number;
      };
    }
> {
  try {
    const response = await axios.post(route.forgot_password, {
      emailaddress: data.email, // match backend
    });

    const resData = response.data;
    const status = response.status;

    if (status === 200 || status === 201) {
      return { success: true, data: resData };
    } else {
      return {
        success: false,
        error: {
          message: resData.message || "Mail not sent",
          description: resData.error || "Unknown error",
          status,
        },
      };
    }
  } catch (error: any) {
  if (axios.isAxiosError(error) && error.response) {
    return {
      success: false,
      error: {
        message: error.response.data?.message || "Request failed",
        description: error.response.data?.error || error.message || "Unknown error",
        status: error.response.status || 500,
      },
    };
  }

  return {
    success: false,
    error: {
      message: "Unknown error",
      description: error.message || "Unexpected failure",
      status: 500,
    },
  };
}

}


