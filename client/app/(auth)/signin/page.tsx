"use client";

import Image from "next/image";
import { useState } from "react";
import { authApi } from "@/lib/api";
import Link from "next/link";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import ActionButton from "@/components/common/ActionButton";
import { jwtDecode } from "jwt-decode";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [loading, setLoading] = useState(false); // ⚡ trạng thái loading

  const [formError, setFormError] = useState("");

  const handleSignIn = async () => {
    const newErrors: typeof errors = {};
    // 🧠 Validate cơ bản trước khi gửi
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true); // ⚡ bật loading

      const res = await authApi.signin({ email, password });
      if (res.status && res.status >= 400) {
        const message = res.message || "Email hoặc password không đúng";
        setFormError(message); // ✅ lỗi toàn form
        return;
      }
      const token = res.access_token || res.data?.access_token;

      if (token) {
        const decoded: any = jwtDecode(token);

        // 🔍 Kiểm tra profile_complete trong token
        if (!decoded.profile_complete) {
          router.push("/complete-profile");
        } else {
          router.push("/dashboard");
        }
      } else {
        // Trường hợp hiếm: server không gửi token (lỗi)
        setFormError("Không nhận được token từ máy chủ.");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đăng nhập thất bại";
      setFormError(message); // ✅ lỗi toàn form
    } finally {
      setLoading(false); // ✅ tắt loading
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral text-neutral-content px-4">
      {/* Logo + Title */}
      <div className="flex flex-col items-center space-y-3 mb-10">
        <Image src="/logo.svg" alt="HabitFlow Logo" width={64} height={64} />
        <h1 className="text-2xl font-bold text-white">Welcome to HabitFlow</h1>
        <p className="text-sm text-gray-400">
          Your journey to better habits starts here
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-base-100 text-base-content rounded-2xl shadow-2xl p-8 flex flex-col gap-5">
        {/* Google SignIn */}
        <button className="flex items-center justify-center gap-2 w-full bg-white text-gray-800 font-medium border border-gray-300 rounded-lg py-2.5 shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]">
          <Image src="/icons/google.svg" alt="Google" width={18} height={18} />
          <span>Sign in with Google</span>
        </button>

        {/* Separator */}
        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-400">or continue with email</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        {formError && (
          <p className="text-sm text-red-500 text-center -mt-3">{formError}</p>
        )}
        {/* Email + Password */}
        <div className="flex flex-col space-y-5">
          {/* Email */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-400 tracking-widest">
              EMAIL <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email)
                  setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              placeholder="your-email@example.com"
              className={`w-full rounded-md bg-[#2a2a2a] border ${
                errors.email ? "border-red-500" : "border-transparent"
              } focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] text-sm text-gray-200 placeholder-gray-500 px-3 py-2 outline-none transition-all duration-200`}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-2">
            <label className="text-xs font-semibold text-gray-400 tracking-widest">
              PASSWORD <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password)
                  setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              placeholder="Password"
              className={`w-full rounded-md bg-[#2a2a2a] border ${
                errors.password ? "border-red-500" : "border-transparent"
              } focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] text-sm text-gray-200 placeholder-gray-500 px-3 py-2 outline-none transition-all duration-200`}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        <ActionButton
          onClick={handleSignIn}
          text={loading ? "Signing in..." : "Sign In"}
          loading={loading}
        />

        {/* Links */}
        <div className="text-sm text-center mt-5 space-y-1">
          <p>
            No account?{" "}
            <Link
              href="/signup"
              className="text-blue-500 hover:underline underline-offset-2 transition-all duration-150"
            >
              Create an account
            </Link>
          </p>
          <p>
            Forgot password?{" "}
            <Link
              href="/forgot-password"
              className="text-blue-500 hover:underline underline-offset-2 transition-all duration-150"
            >
              Reset here
            </Link>
          </p>
        </div>

        <p className="text-xs text-gray-400 text-center mt-6">
          By continuing, you agree to our{" "}
          <a href="#" className="link link-primary">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="link link-primary">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
