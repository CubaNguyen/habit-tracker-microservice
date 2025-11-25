// 📁 app/api/auth/verify-email/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { user_id, code } = await req.json();

    const url = `${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/auth/verify-email`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Xác minh thất bại" },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Email verified successfully!",
    });
  } catch (error) {
    console.error("❌ Lỗi verify email:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi máy chủ khi xác minh email" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "Thiếu user_id" },
        { status: 400 }
      );
    }

    // 🌐 Gọi Auth Service qua API Gateway
    const url = `${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/auth/users/${user_id}`;

    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    console.log("🚀 ~ VerifyEmail GET ~ data:", data);

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Không tìm thấy user" },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message,
      user: data.data,
      is_verified: data.data?.is_email_verified ?? false,
    });
  } catch (error) {
    console.error("❌ Lỗi kiểm tra verify email:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi máy chủ khi kiểm tra email" },
      { status: 500 }
    );
  }
}
