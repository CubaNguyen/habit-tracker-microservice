// app/api/habit/route.ts
import { NextRequest, NextResponse } from "next/server";

// Lấy base URL Gateway từ biến môi trường
const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY;

function getAuthToken(req: NextRequest) {
  return req.cookies.get("access_token")?.value;
}

// 🧠 GET /api/habit  → Lấy danh sách habits (theo user qua token)
export async function GET(req: NextRequest) {
  const token = getAuthToken(req);
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: missing token" },
      { status: 401 }
    );
  }
  const { searchParams } = req.nextUrl;
  const date = searchParams.get("date");

  // 🔥 Build URL backend
  const url = date
    ? `${API_GATEWAY}/habit/habits?date=${date}`
    : `${API_GATEWAY}/habit/habits`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // GẮN TOKEN VÀO HEADER
        Authorization: `Bearer ${token}`,
      },
      // nếu cần forward query string, có thể lấy từ req.nextUrl.search
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to fetch habits" },
        { status: res.status }
      );
    }

    // Backend đang dùng ApiResponse.success(message, data)
    // nên dữ liệu thật thường nằm ở data.data
    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ GET /api/habit error:", err);
    return NextResponse.json(
      { message: "Server error when fetching habits" },
      { status: 500 }
    );
  }
}

// 🧠 POST /api/habit  → Tạo habit mới
export async function POST(req: NextRequest) {
  const token = getAuthToken(req);
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: missing token" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const url = `${API_GATEWAY}/habit/habits`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // GẮN TOKEN VÀO HEADER
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    console.log("🚀 ~ POST ~ res habit nef :", res);

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to create habit" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ POST /api/habit error:", err);
    return NextResponse.json(
      { message: "Server error when creating habit" },
      { status: 500 }
    );
  }
}
