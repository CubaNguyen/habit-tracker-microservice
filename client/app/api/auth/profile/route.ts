import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Chưa đăng nhập" },
        { status: 401 }
      );
    }

    // 🔥 Gửi request tới Gateway
    const url = `${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/profile`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();

    // ❌ Nếu backend trả lỗi
    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // ✅ Nếu update thành công → trả đúng format backend, không bọc thêm
    const response = NextResponse.json(data, { status: res.status });

    // ✅ Cập nhật cookie mới nếu backend trả về tokens
    if (data.data?.tokens?.access_token) {
      response.cookies.set("access_token", data.data.tokens.access_token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 15, // 15 phút
      });
    }

    if (data.data?.tokens?.refresh_token) {
      response.cookies.set("refresh_token", data.data.tokens.refresh_token, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 ngày
      });
    }

    return response;
  } catch (error) {
    console.error("❌ PUT /api/auth/profile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
