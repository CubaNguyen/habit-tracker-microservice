import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// 🧠 GET /api/profile
export async function GET(req: NextRequest) {
  try {
    // 🔹 Lấy access_token từ cookie
    const token = req.cookies.get("access_token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: missing token" },
        { status: 401 }
      );
    }

    // 🔹 Giải mã JWT để lấy user_id
    const decoded: any = jwt.decode(token);
    if (!decoded || !decoded.sub) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const user_id = decoded.sub;
    const email = decoded.email;

    // 🔹 Gọi xuống Auth Service hoặc Profile Service qua API Gateway
    const url = `${process.env.NEXT_PUBLIC_API_GATEWAY}/auth/profile/${user_id}`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let data = await res.json();

    // ❌ Nếu backend báo lỗi
    if (!res.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch profile" },
        { status: res.status }
      );
    }
    data = data.data;

    // ✅ Trả về dữ liệu profile + email từ session
    return NextResponse.json({
      success: true,
      profile: {
        id: data.id,
        user_id: data.user_id,
        full_name: data.full_name,
        avatar_url: data.avatar_url,
        bio: data.bio,
        timezone: data.timezone,
        email,
      },
    });
  } catch (error) {
    console.error("❌ GET /api/profile error:", error);
    return NextResponse.json(
      { message: "Server error when fetching profile" },
      { status: 500 }
    );
  }
}
