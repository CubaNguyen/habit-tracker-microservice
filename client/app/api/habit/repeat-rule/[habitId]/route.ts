// app/api/habit/[habitId]/repeat-rule/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY;

function getAuthToken(req: NextRequest) {
  return req.cookies.get("access_token")?.value;
}

// 🧠 GET /api/habit/:habitId/repeat-rule
export async function GET(
  req: NextRequest,
  context: { params: { habitId: string } }
) {
  const token = getAuthToken(req);
  const { habitId } = context.params;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: missing token" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${API_GATEWAY}/habits/${habitId}/repeat-rule`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to fetch repeat rule" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ GET /api/habit/[habitId]/repeat-rule error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// 🧠 POST /api/habit/:habitId/repeat-rule
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ habitId: string }> }
) {
  const token = getAuthToken(req);
  const { habitId } = await context.params;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: missing token" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const res = await fetch(
      `${API_GATEWAY}/habit/habits/${habitId}/repeat-rule`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to create repeat rule" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ POST /api/habit/[habitId]/repeat-rule error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// 🧠 PUT /api/habit/:habitId/repeat-rule
export async function PUT(
  req: NextRequest,
  context: { params: { habitId: string } }
) {
  const token = getAuthToken(req);
  const { habitId } = context.params;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: missing token" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const res = await fetch(
      `${API_GATEWAY}/habit/habits/${habitId}/repeat-rule`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message || "Failed to update repeat rule" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ PUT /api/habit/[habitId]/repeat-rule error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// 🧠 DELETE /api/habit/:habitId/repeat-rule
export async function DELETE(
  req: NextRequest,
  context: { params: { habitId: string } }
) {
  const token = getAuthToken(req);
  const { habitId } = context.params;

  if (!token) {
    return NextResponse.json(
      { message: "Unauthorized: missing token" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(`${API_GATEWAY}/habits/${habitId}/repeat-rule`, {
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
        { message: data?.message || "Failed to delete repeat rule" },
        { status: res.status }
      );
    }

    return NextResponse.json(data ?? { success: true });
  } catch (err) {
    console.error("❌ DELETE /api/habit/[habitId]/repeat-rule error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
