// app/api/habit/tags/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY;

function getAuthToken(req: NextRequest) {
  return req.cookies.get("access_token")?.value;
}

// 🧠 GET /api/habit/tags → lấy danh sách tag
export async function GET(req: NextRequest) {
  const token = getAuthToken(req);
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: missing token" },
      { status: 401 }
    );
  }

  try {
    const url = `${API_GATEWAY}/habit/tags`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to fetch tags" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ GET /api/habit/tags error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// 🧠 POST /api/habit/tags → tạo tag mới
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
    const url = `${API_GATEWAY}/habit/tags`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to create tag" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ POST /api/habit/tags error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
