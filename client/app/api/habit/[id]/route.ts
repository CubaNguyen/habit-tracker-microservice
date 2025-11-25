// app/api/habit/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY;

function getAuthToken(req: NextRequest) {
  return req.cookies.get("access_token")?.value;
}

// 🧠 GET /api/habit/:id  → Lấy chi tiết habit
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const token = getAuthToken(req);
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: missing token" },
      { status: 401 }
    );
  }

  const { id } = context.params;

  try {
    const url = `${API_GATEWAY}/habit/habits/${id}`;
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
        { message: data?.message || "Failed to fetch habit" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ GET /api/habit/[id] error:", err);
    return NextResponse.json(
      { message: "Server error when fetching habit" },
      { status: 500 }
    );
  }
}

// 🧠 PUT /api/habit/:id  → Cập nhật habit
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const token = getAuthToken(req);
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: missing token" },
      { status: 401 }
    );
  }

  const { id } = context.params;

  try {
    const body = await req.json();
    const url = `${API_GATEWAY}/habit/habits/${id}`;

    const res = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to update habit" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ PUT /api/habit/[id] error:", err);
    return NextResponse.json(
      { message: "Server error when updating habit" },
      { status: 500 }
    );
  }
}

// 🧠 DELETE /api/habit/:id  → Xóa habit
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const token = getAuthToken(req);
  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: missing token" },
      { status: 401 }
    );
  }

  const { id } = context.params;

  try {
    const url = `${API_GATEWAY}/habits/${id}`;

    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Có thể backend trả body rỗng; ta cố gắng parse, nếu fail thì trả status thôi
    let data: any = null;
    try {
      data = await res.json();
    } catch {
      // ignore
    }

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to delete habit" },
        { status: res.status }
      );
    }

    return NextResponse.json(data ?? { success: true });
  } catch (err) {
    console.error("❌ DELETE /api/habit/[id] error:", err);
    return NextResponse.json(
      { message: "Server error when deleting habit" },
      { status: 500 }
    );
  }
}
