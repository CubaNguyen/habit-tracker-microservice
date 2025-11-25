// app/api/habit/milestones/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY;

function getAuthToken(req: NextRequest) {
  return req.cookies.get("access_token")?.value;
}

// 🧠 GET /api/habit/milestones/:id
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
    const res = await fetch(`${API_GATEWAY}/habit/milestones/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to fetch milestone" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ GET /api/habit/milestones/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// 🧠 PUT /api/habit/milestones/:id
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
    const res = await fetch(`${API_GATEWAY}/milestones/${id}`, {
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
        { message: data?.message || "Failed to update milestone" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ PUT /api/habit/milestones/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// 🧠 DELETE /api/habit/milestones/:id
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const token = getAuthToken(req);
  const { id } = context.params;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const res = await fetch(`${API_GATEWAY}/habit/milestones/${id}`, {
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
        { message: data?.message || "Failed to delete milestone" },
        { status: res.status }
      );
    }

    return NextResponse.json(data ?? { success: true });
  } catch (err) {
    console.error("❌ DELETE /api/habit/milestones/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
