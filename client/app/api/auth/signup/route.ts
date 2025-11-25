import { NextResponse } from "next/server";

/**
 * [POST] /api/auth/signup
 * Body: { email: string, password: string }
 */
export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 🚀 Gọi tới Auth Service qua API Gateway
    const url = `${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/auth/signup`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Đăng ký thất bại" },
        { status: res.status }
      );
    }

    // ✅ Trả về thông tin user & token sau khi đăng ký thành công
    return NextResponse.json({
      message: "Đăng ký thành công",
      user: data.data,
    });
  } catch (error) {
    console.error("❌ Lỗi đăng ký:", error);
    return NextResponse.json(
      { message: "Lỗi máy chủ khi đăng ký" },
      { status: 500 }
    );
  }
}
