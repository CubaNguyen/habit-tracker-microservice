"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "@/lib/api/auth";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await authApi.getSession();
        if (!session.authenticated) {
          setAuthenticated(false);
          return;
        }

        setAuthenticated(true);
        setProfileComplete(session.profile_complete);

        // 🔥 Gọi thêm getProfile để lấy thông tin chi tiết
        const profile = await authApi.getProfile();
        setUser(profile.profile);
      } catch (err) {
        console.error("❌ Auth init failed:", err);
        setAuthenticated(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, authenticated, profileComplete, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
