// app/api/habit/tags/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY;

function getAuthToken(req: NextRequest) {
  return req.cookies.get("access_token")?.value;
}

// 🧠 GET /api/habit/tags/:id → lấy chi tiết tag
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const token = getAuthToken(req);
  const { id } = context.params;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_GATEWAY}/habit/tags/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to fetch tag" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ GET /api/habit/tags/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// 🧠 DELETE /api/habit/tags/:id → xóa tag
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = getAuthToken(req);
  const { id } = await context.params;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_GATEWAY}/habit/tags/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    let data: any = null;
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to delete tag" },
        { status: res.status }
      );
    }

    return NextResponse.json(data ?? { success: true });
  } catch (err) {
    console.error("❌ DELETE /api/habit/tags/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
