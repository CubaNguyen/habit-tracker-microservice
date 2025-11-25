// app/api/habit/milestones/habits/[habitId]/route.ts
import { NextRequest, NextResponse } from "next/server";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY;

function getAuthToken(req: NextRequest) {
  return req.cookies.get("access_token")?.value;
}

// 🧠 GET /api/habit/milestones/habits/:habitId
export async function GET(
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
    const url = `${API_GATEWAY}/habit/milestones/habits/${habitId}`;
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
        { message: data?.message || "Failed to fetch milestones" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ GET /api/habit/milestones/habits/[habitId] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// 🧠 POST /api/habit/milestones/habits/:habitId
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
    const url = `${API_GATEWAY}/habit/milestones/habits/${habitId}`;

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
        { message: data?.message || "Failed to create milestone" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("❌ POST /api/habit/milestones/habits/[habitId] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
