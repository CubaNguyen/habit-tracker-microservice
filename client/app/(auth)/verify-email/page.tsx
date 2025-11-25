"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth"; // import các hàm API
import { stringify } from "querystring";
import ActionButton from "@/components/common/ActionButton";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const user_id = searchParams.get("userid");
  const [resending, setResending] = useState(false);

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  useEffect(() => {
    const checkStatus = async () => {
      if (!user_id) return;
      try {
        const res = await authApi.checkVerifyStatus(user_id);
        // alert(JSON.stringify(res));
        setEmail(res.user.email);
        if (res.user.is_email_verified) {
          router.push("/signin");
        }
      } catch (err) {
        console.error("❌ Error checking verification:", err);
      } finally {
        setChecking(false);
      }
    };

    checkStatus();
  }, [user_id, router]);

  // ✅ Xử lý khi người dùng nhập mã và nhấn Verify
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const id = user_id ? Number(user_id) : undefined;

    try {
      const res = await authApi.verifyEmail({ user_id: id, code });
      setMessage(res.message || "Email verified successfully!");

      // Sau khi verify thành công → đợi 1s rồi chuyển qua signin
      setTimeout(() => router.push("/signin"), 1000);
    } catch (err: any) {
      setError(err.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending) return; // tránh spam click
    setResending(true);
    setError(null);
    setMessage(null);

    try {
      const res = await authApi.resendVerification(email);
      setMessage(res.message || "Verification email resent successfully!");

      // Thêm cooldown 30s trước khi cho resend lại
      setTimeout(() => setResending(false), 30000);
    } catch (err: any) {
      setError(err.message || "Failed to resend verification email.");
      setResending(false);
    }
  };

  // ✅ Loading khi đang kiểm tra trạng thái verify
  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f0f10] text-gray-400">
        Checking your account...
      </div>
    );
  }

  // ✅ Form verify chính
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f10] text-gray-100 px-4">
      {/* icon phong bì */}
      <div className="w-14 h-14 bg-[#2563eb]/20 rounded-xl flex items-center justify-center mb-6 border border-[#2563eb]/40">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8 text-[#60a5fa]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l9 6 9-6"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 8v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8"
          />
        </svg>
      </div>

      <div className="max-w-sm w-full bg-[#18181b] shadow-lg rounded-2xl p-8 border border-gray-800">
        <h2 className="text-xl font-semibold text-gray-100 text-center mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          Enter the verification code we sent to your email.
        </p>

        <form onSubmit={handleVerify}>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Verification Code <span className="text-[#3b82f6]">*</span>
          </label>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full bg-[#0f0f10] border border-gray-700 rounded-md px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent mb-3"
            placeholder="Enter code"
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

          <ActionButton type="submit" text="Verify" loading={loading} />
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleResend}
            disabled={resending}
            className={`text-sm ${
              resending
                ? "text-gray-500 cursor-not-allowed"
                : "text-[#3b82f6] hover:underline"
            }`}
          >
            {resending ? "Sending..." : "Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}
