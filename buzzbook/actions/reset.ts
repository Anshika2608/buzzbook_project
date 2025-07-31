
import axios from "axios";
import { ResetPasswordFormData, ResetPasswordSchema } from "@/lib/validation/ResetSchema";

export default async function resetPassword(
  data: ResetPasswordFormData,
  id: string,
  token: string
) {
  const validation = ResetPasswordSchema.safeParse(data);

  if (!validation.success) {
    const fieldErrors: Record<string, string> = {};
    validation.error.errors.forEach((error) => {
      fieldErrors[error.path[0]] = error.message;
    });
    return { success: false, fieldErrors };
  }

  try {
    const res = await axios.post(
      `https://buzzbook-server-dy0q.onrender.com/auth/${id}/${token}`,
      {
        passwords: data.password,
      },{
        withCredentials: false,
      }
    );

    return {
      success: true,
      message: res.data.message || "Password reset successfully",
    };
  } catch (error: any) {
    return {
      success: false,
      error: {
        message: error?.response?.data?.message || "Something went wrong",
        status: error?.response?.status || 500,
      },
    };
  }
}
