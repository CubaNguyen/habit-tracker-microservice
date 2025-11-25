// app/api/habit/categories/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY;

function getAuthToken(req: NextRequest) {
  return req.cookies.get("access_token")?.value;
}

// 🧠 GET /api/habit/categories/:id
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
    const res = await fetch(`${API_GATEWAY}/categories/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to fetch category" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ GET /api/habit/categories/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// 🧠 PUT /api/habit/categories/:id
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const token = getAuthToken(req);
  const { id } = context.params;
  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const res = await fetch(`${API_GATEWAY}/habit/categories/${id}`, {
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
        { message: data?.message || "Failed to update category" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ PUT /api/habit/categories/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// 🧠 DELETE /api/habit/categories/:id
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = getAuthToken(req);
  const { id } = await context.params;
  console.log("🚀 ~ DELETE ~ id:", id);

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_GATEWAY}/habit/categories/${id}`, {
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
        { message: data?.message || "Failed to delete category" },
        { status: res.status }
      );
    }

    return NextResponse.json(data ?? { success: true });
  } catch (err) {
    console.error("❌ DELETE /api/habit/categories/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
