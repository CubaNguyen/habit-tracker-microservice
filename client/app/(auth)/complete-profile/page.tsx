"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import ActionButton from "@/components/common/ActionButton";
import Cookies from "js-cookie";

export default function CompleteProfilePage() {
  const [form, setForm] = useState({
    full_name: "",
    bio: "",
    timezone:
      Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Ho_Chi_Minh",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const data = (await authApi.updateProfile(form)) as any;
      if (data.success) {
        setMessage("Cập nhật thành công!");
        router.replace("/dashboard");
      } else {
        setError(data.message || "Cập nhật thất bại");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const token = Cookies.get("access_token");
    if (!token) {
      console.log("⚠️ Không có token, redirect về /signin");
      router.replace("/signin");
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f10] text-gray-100">
      <div className="w-full max-w-md bg-[#18181b] p-8 rounded-2xl border border-gray-800 shadow-lg">
        <h2 className="text-xl font-semibold text-center mb-2">
          Complete Your Profile
        </h2>
        <p className="text-gray-400 text-center text-sm mb-6">
          Tell us a bit more about yourself to get started.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Full Name *
            </label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
              required
              className="w-full bg-[#0f0f10] border border-gray-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3b82f6] text-gray-100"
              placeholder="Your full name"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              className="w-full bg-[#0f0f10] border border-gray-700 rounded-md px-3 py-2 h-24 focus:ring-2 focus:ring-[#3b82f6] text-gray-100 resize-none"
              placeholder="Tell us something about yourself..."
            ></textarea>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Timezone *
            </label>
            <select
              name="timezone"
              value={form.timezone}
              onChange={handleChange}
              className="w-full bg-[#0f0f10] border border-gray-700 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#3b82f6] text-gray-100"
            >
              <option value="Asia/Ho_Chi_Minh">
                Asia/Ho_Chi_Minh (Vietnam)
              </option>
              <option value="Asia/Bangkok">Asia/Bangkok</option>
              <option value="Asia/Singapore">Asia/Singapore</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          {/* ✅ Dùng ActionButton thay button thường */}
          <ActionButton
            type="submit"
            text="Save & Continue"
            loading={loading}
            disabled={!form.full_name || !form.timezone}
          />
        </form>
      </div>
    </div>
  );
}
