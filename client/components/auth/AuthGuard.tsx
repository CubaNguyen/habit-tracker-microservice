"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/(auth)/context/AuthContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { authenticated, profileComplete, loading } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!authenticated) {
      router.replace("/signin");
    } else if (!profileComplete) {
      router.replace("/complete-profile");
    }
  }, [authenticated, profileComplete, loading, router]);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-300">
        Đang kiểm tra đăng nhập...
      </div>
    );

  return <>{children}</>;
}
