import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: "Thiếu email" },
        { status: 400 }
      );
    }

    const url = `${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/auth/resend-verification`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { success: false, message: data.message || "Không thể gửi lại email" },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      message: data.message || "Verification email resent successfully!",
    });
  } catch (error) {
    console.error("❌ Lỗi resend email:", error);
    return NextResponse.json(
      { success: false, message: "Lỗi máy chủ khi gửi lại email xác minh" },
      { status: 500 }
    );
  }
}
