import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const access = req.cookies.get("access_token")?.value;
  const refresh = req.cookies.get("refresh_token")?.value;

  // ✅ Nếu truy cập root "/", chuyển sang /signin
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // 🚫 Nếu chưa có token nào mà vào dashboard → đẩy về /signin
  if (!access && !refresh && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // 🚫 Đã login mà vào signin/signup → đẩy qua dashboard
  if (
    (access || refresh) &&
    (pathname.startsWith("/signin") || pathname.startsWith("/signup"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // ✅ Nếu chưa login mà vào signin/signup → cho phép
  if (
    !access &&
    !refresh &&
    (pathname.startsWith("/signin") || pathname.startsWith("/signup"))
  ) {
    return NextResponse.next();
  }

  // ⚙️ Nếu có access_token thì decode để check profile_complete
  if (access) {
    try {
      const decoded: any = jwt.decode(access);

      // 🧩 Nếu user chưa hoàn thiện profile mà cố vào dashboard
      if (
        pathname.startsWith("/dashboard") &&
        decoded?.profile_complete === false
      ) {
        return NextResponse.redirect(new URL("/complete-profile", req.url));
      }

      // 🧩 Nếu user đã hoàn thiện profile mà cố vào /complete-profile
      if (
        pathname.startsWith("/complete-profile") &&
        decoded?.profile_complete === true
      ) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } catch (err) {
      console.error("⚠️ Decode token error:", err);
    }
  }

  // ✅ Mặc định cho qua
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/signin",
    "/signup",
    "/complete-profile",
  ],
};
