"use client";

import { useAuth } from "@/app/(auth)/context/AuthContext";
import { authApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export default function UserMenu() {
  const [userInfor, setUserInfor] = useState<any>([]);
  const { user } = useAuth();
  // if (user) {
  //   setUserInfor(user);
  // }
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleSignOut = async () => {
    try {
      const res = await authApi.signout();
      router.push("/signin"); // chuyển về trang đăng nhập
    } catch (err: any) {}
  };

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* Nút hiển thị user */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className=" w-full justify-between flex items-center gap-2 px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition"
      >
        <div className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full font-bold">
          D
        </div>
        <span className="flex-1 min-w-0 text-right truncate text-sm">
          {user?.full_name}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-gray-900 text-white rounded-md shadow-lg border border-gray-700 z-50">
          <ul className="py-2 text-sm">
            <li>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-800"
                onClick={() => alert("Go to Profile")}
              >
                Profile
              </button>
            </li>
            <li>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-800"
                onClick={() => handleSignOut()}
              >
                Sign Out
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
