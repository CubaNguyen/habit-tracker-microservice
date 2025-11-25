// 📁 lib/api/auth.ts
import { apiFetcher } from "../fetcher";

export const authApi = {
  signin: (data: any) =>
    apiFetcher("/api/auth/signin", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  signup: (data: any) =>
    apiFetcher("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  verifyEmail: (data: any) =>
    apiFetcher("/api/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  checkVerifyStatus: (user_id: string | number) =>
    apiFetcher(`/api/auth/verify-email?user_id=${user_id}`, {
      method: "GET",
    }),
  resendVerification: (email: string) =>
    apiFetcher("/api/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  signout: () =>
    apiFetcher("/api/auth/signout", {
      method: "POST",
    }),
  forgotPassword: (data: { email: string }) =>
    apiFetcher("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resetPassword: (data: { email: string; code: string; password: string }) =>
    apiFetcher("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  changePassword: (data: { oldPassword: string; newPassword: string }) =>
    apiFetcher("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateProfile: (data: any) =>
    apiFetcher("/api/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  refreshToken: (refresh_token: string) =>
    apiFetcher("/api/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refresh_token }),
    }),
  getSession: () =>
    apiFetcher("/api/auth/session", {
      method: "GET",
      credentials: "include", // cần để gửi cookie
    }),
  getProfile: () => apiFetcher("/api/profile", { method: "GET" }),
};
