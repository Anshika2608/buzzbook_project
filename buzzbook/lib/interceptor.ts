import axios, { AxiosError } from "axios";

import { route } from "@/lib/api";
interface FailedRequest {
  resolve: (token?: string | null) => void;
  reject: (err: AxiosError | Error) => void;
}
// ===============================
// Create Axios Instance
// ===============================
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  withCredentials: true, // send cookies (access + refresh)
});


// ===============================
// Response Interceptor
// Auto Refresh Access Token + Retry Logic
// ===============================
let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

const processQueue = (error: AxiosError | Error | null, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // If access token expired → backend returns 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(originalRequest)),
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        await api.get(route.refreshToken);

        // All queued requests will now continue
        processQueue(null, null);

        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        const err: Error =
          refreshError instanceof Error
            ? refreshError
            : new Error("Unexpected refresh error");

        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
