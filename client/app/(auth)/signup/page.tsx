"use client";

import Image from "next/image";
import { useState } from "react";
import { authApi } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ActionButton from "@/components/common/ActionButton";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirm?: string;
  }>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false); // ⚡ thêm loading state
  const router = useRouter();

  const handleSignUp = async () => {
    const newErrors: typeof errors = {};

    // ✅ Validate cơ bản
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    if (!confirm.trim()) newErrors.confirm = "Please re-enter your password";
    if (password && confirm && password !== confirm)
      newErrors.confirm = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setFormError("");

      const res = await authApi.signup({ email, password });

      // 🔎 Kiểm tra response
      if (!res || (res.status && res.status >= 400)) {
        const message = res?.message || "Registration failed";
        setFormError(message);
        return;
      }

      // ✅ Điều hướng ngay sau khi đăng ký thành công
      router.push(`/verify-email?userid=${res.user}`);
    } catch (err) {
      console.error("🚀 ~ handleSignUp ~ err:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setFormError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral text-neutral-content px-4">
      {/* Logo + Title */}
      <div className="flex flex-col items-center space-y-3 mb-10">
        <Image src="/logo.svg" alt="HabitFlow Logo" width={64} height={64} />
        <h1 className="text-2xl font-bold text-white">Create new Account</h1>
        <p className="text-sm text-gray-400">
          Start building your habits today
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-base-100 text-base-content rounded-2xl shadow-2xl p-8 flex flex-col gap-5">
        {/* ⚠️ Lỗi toàn form */}
        {formError && (
          <p className="text-sm text-red-500 text-center -mt-2">{formError}</p>
        )}

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

        {/* Confirm Password */}
        <div className="flex flex-col space-y-2">
          <label className="text-xs font-semibold text-gray-400 tracking-widest">
            RE-ENTER PASSWORD <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => {
              setConfirm(e.target.value);
              if (errors.confirm)
                setErrors((prev) => ({ ...prev, confirm: undefined }));
            }}
            placeholder="Re-enter password"
            className={`w-full rounded-md bg-[#2a2a2a] border ${
              errors.confirm ? "border-red-500" : "border-transparent"
            } focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6] text-sm text-gray-200 placeholder-gray-500 px-3 py-2 outline-none transition-all duration-200`}
          />
          {errors.confirm && (
            <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>
          )}
        </div>

        {/* Sign Up Button */}
        <ActionButton onClick={handleSignUp} text="Sign Up" loading={loading} />

        {/* Links */}
        <div className="text-sm text-center mt-5 space-y-1">
          <p>
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-blue-500 hover:underline underline-offset-2 transition-all duration-150"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
