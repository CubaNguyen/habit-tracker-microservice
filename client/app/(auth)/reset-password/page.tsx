"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { authApi } from "@/lib/api/auth";
import ActionButton from "@/components/common/ActionButton";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await authApi.resetPassword({ email, code, password });
      setMessage(res.message || "Password reset successfully!");
      setTimeout(() => router.push("/signin"), 1500);
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f10] text-gray-100">
      <div className="bg-[#18181b] p-8 rounded-2xl shadow-lg max-w-md w-full border border-gray-800">
        <h2 className="text-xl font-semibold mb-2 text-center">
          Reset Your Password
        </h2>
        <p className="text-gray-400 text-center mb-6 text-sm">
          Enter the code sent to your email and your new password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            required
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter verification code"
            className="w-full bg-[#0f0f10] border border-gray-700 rounded-md px-3 py-2 mb-3 text-gray-100 focus:ring-2 focus:ring-[#3b82f6]"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full bg-[#0f0f10] border border-gray-700 rounded-md px-3 py-2 mb-3 text-gray-100 focus:ring-2 focus:ring-[#3b82f6]"
          />

          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {message && <p className="text-green-500 text-sm mb-2">{message}</p>}

          <ActionButton
            type="submit"
            text={loading ? "Resetting..." : "Reset Password"}
            loading={loading}
          />
        </form>
      </div>
    </div>
  );
}
