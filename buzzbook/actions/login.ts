// "use server";

// import axios from "axios";
// import { z } from "zod";
// import { route } from "@/lib/api";

// // 1. Define the Zod schema for login form validation
// export const LoginSchema = z.object({
//   email: z.string().email("Enter a valid email"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
//   recaptchaToken: z.string().min(1, "reCAPTCHA token is required"),
// });

// export type LoginFormData = z.infer<typeof LoginSchema>;

// // 2. Server action for login
// export default async function login(formData: LoginFormData) {
//   // Validate input
//   const result = LoginSchema.safeParse(formData);

//   if (!result.success) {
//     const fieldErrors: Record<string, string> = {};
//     result.error.errors.forEach((err) => {
//       fieldErrors[err.path[0]] = err.message;
//     });

//     return {
//       success: false,
//       fieldErrors,
//     };
//   }

//   try {
//     const { email, password, recaptchaToken } = formData;

//     const { data, status } = await axios.post(route.login, {
//       email,
//       password,
//       recaptchaToken,
//     });

//     if (status === 201) {
//       return {
//         success: true,
//         data,
//       };
//     } else {
//       return {
//         success: false,
//         error: {
//           message: data.message || "Login failed",
//           description: data.error || "Unknown error",
//           status,
//         },
//       };
//     }
//   } catch (error: unknown) {
//     let errMsg = "Something went wrong";
//     let errDesc = "";
//     let errStatus = 500;

//     if (axios.isAxiosError(error)) {
//       errMsg = error.response?.data?.message || errMsg;
//       errDesc = error.response?.data?.error || error.message;
//       errStatus = error.response?.status || errStatus;
//     } else if (error instanceof Error) {
//       errDesc = error.message;
//     }

//     return {
//       success: false,
//       error: {
//         message: errMsg,
//         description: errDesc,
//         status: errStatus,
//       },
//     };
//   }
// }

// "use server";

// import { LoginSchema, LoginFormData } from "@/lib/validation/Loginschema";
// import { route } from "@/lib/api";
// import axios from "axios";

// export default async function login(formData: LoginFormData) {
//   const validationResult = LoginSchema.safeParse(formData);
//   if (!validationResult.success) {
//     const fieldErrors: Record<string, string> = {};
//     validationResult.error.errors.forEach((error) => {
//       fieldErrors[error.path[0]] = error.message;
//     });

//     return {
//       success: false,
//       fieldErrors,
//     };
//   }

//   try {
//     const { email, password, recaptchaToken } = formData;
//     const response = await axios.post(
//       route.login,
//       { email, password, recaptchaToken },
//       { withCredentials: true }
//     );

//     const { data, status } = response;
//     if (status === 200 || status === 201) {
//       return {
//         success: true,
//         data,
//       };
//     }
//     return {
//       success: false,
//       error: {
//         message: data.message || "Login failed",
//         description: data.error || "Unexpected server response",
//         status,
//       },
//     };
//   } catch (error: any) {
//     console.error("Login API error:", error);

//     let message = "Something went wrong";
//     let description = "";
//     let status = 500;

//     if (axios.isAxiosError(error)) {
//       message = error.response?.data?.message || message;
//       description = error.response?.data?.error || error.message;
//       status = error.response?.status || status;
//     } else if (error instanceof Error) {
//       description = error.message;
//     }

//     return {
//       success: false,
//       error: {
//         message,
//         description,
//         status,
//       },
//     };
//   }
// }


import { LoginSchema, LoginFormData } from "@/lib/validation/Loginschema";
import { route } from "@/lib/api";
import axios from "axios";

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
    const response = await axios.post(
      route.login,
      { email, password, recaptchaToken },
      { withCredentials: true }
    );

    const { data, status } = response;

    if (status === 200 || status === 201) {
      const { accessToken, user } = data;

      // ✅ Save access token in localStorage
      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

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


