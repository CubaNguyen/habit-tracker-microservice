import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// ✅ API kiểm tra phiên đăng nhập
export async function GET(req: Request) {
  try {
    // 🔹 Lấy cookie từ header
    const cookies = req.headers.get("cookie") || "";

    const getCookie = (name: string) =>
      cookies
        .split("; ")
        .find((x) => x.startsWith(name + "="))
        ?.split("=")[1];

    const access = getCookie("access_token");
    const refresh = getCookie("refresh_token");

    // 🔹 Không có token nào => chưa login
    if (!access && !refresh) {
      return NextResponse.json({
        authenticated: false,
        profile_complete: false,
      });
    }

    // 🔹 Nếu có access_token thì verify luôn
    if (access) {
      try {
        const decoded: any = jwt.verify(
          access,
          process.env.NEXT_PUBLIC_JWT_SECRET!
        );
        return NextResponse.json({
          authenticated: true,
          profile_complete: decoded.profile_complete,
          user: { id: decoded.sub, email: decoded.email },
        });
      } catch (err) {
        // token hết hạn → xử lý dưới
        console.log("⚠️ access_token expired:", (err as Error).message);
      }
    }

    // 🔹 Nếu access_token hết hạn mà có refresh_token thì gọi qua Auth Service
    if (!access && refresh) {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/auth/refresh-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh_token: refresh }),
        }
      );

      if (!res.ok) {
        return NextResponse.json({
          authenticated: false,
          profile_complete: false,
        });
      }

      const data = await res.json();
      const newAccess = data.data?.access_token;
      if (!newAccess) {
        return NextResponse.json({
          authenticated: false,
          profile_complete: false,
        });
      }

      // ✅ Decode để lấy user info
      const decoded: any = jwt.decode(newAccess);
      // ✅ Set lại cookie access_token mới
      const response = NextResponse.json({
        authenticated: true,
        profile_complete: decoded.profile_complete,
        user: { id: decoded.sub, email: decoded.email },
      });

      response.cookies.set("access_token", newAccess, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 15, // 15 phút
      });

      return response;
    }

    // 🔹 Không còn refresh_token → chưa đăng nhập
    return NextResponse.json({ authenticated: false, profile_complete: false });
  } catch (error) {
    console.error("❌ /api/auth/session error:", error);
    return NextResponse.json(
      { authenticated: false, profile_complete: false },
      { status: 500 }
    );
  }
}
