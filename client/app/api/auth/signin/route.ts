import { NextResponse } from "next/server";

/**
 * [POST] /api/auth/signin
 * Body: { email: string, password: string }
 */
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const url = `${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/auth/signin`;

    // 🌐 Gọi đến Auth Service qua Gateway (8080)
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Sai tài khoản hoặc mật khẩu" },
        { status: res.status }
      );
    }
    const accessToken = data.data?.access_token || data.access_token || null;
    const refreshToken = data.data?.refresh_token || data.refresh_token || null;

    if (!accessToken || !refreshToken) {
      console.error("⚠️ Thiếu token trong response:", data);
      return NextResponse.json(
        { success: false, message: "Không nhận được token đăng nhập" },
        { status: 500 }
      );
    }
    const response = NextResponse.json({
      success: true,
      message: data.message || "Đăng nhập thành công",
      user: data.data?.user || data.user || null,
      access_token: accessToken, // 👈 cần có dòng này

      accessToken,
    });
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 15, // 15 phút
    });

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 ngày
    });

    return response;
  } catch (error) {
    console.error("❌ Lỗi đăng nhập:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ khi đăng nhập" },
      { status: 500 }
    );
  }
}
