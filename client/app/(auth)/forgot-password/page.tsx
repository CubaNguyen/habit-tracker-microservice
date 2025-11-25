"use client";
import { useState, useEffect } from "react";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import ActionButton from "@/components/common/ActionButton";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const router = useRouter();

  // 🕐 Countdown mỗi 1 giây
  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCountdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await authApi.forgotPassword({ email });
      setMessage(res.message || "Verification code sent!");
      setResendCountdown(10); // ⏳ chờ 10s mới gửi lại được
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = () => {
    router.push(`/reset-password?email=${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f10] text-gray-100">
      <div className="bg-[#18181b] p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-800">
        <h2 className="text-xl font-semibold mb-2 text-center">
          Forgot Password?
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          Enter your email and we’ll send you a reset code.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full bg-[#0f0f10] border border-gray-700 rounded-md px-3 py-2 mb-3 text-gray-100 focus:ring-2 focus:ring-[#3b82f6]"
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

          <ActionButton
            type="submit"
            text={
              loading
                ? "Sending..."
                : resendCountdown > 0
                ? `Resend in ${resendCountdown}s`
                : "Send Reset Code"
            }
            loading={loading}
            disabled={resendCountdown > 0}
          />
        </form>

        {message && (
          <div className="text-center mt-4">
            <button
              onClick={handleNextStep}
              className="text-sm text-[#3b82f6] hover:underline"
            >
              Already got code? Reset now →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
