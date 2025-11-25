import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY;

function getAuthToken(req: NextRequest) {
  return req.cookies.get("access_token")?.value;
}

export async function GET(req: NextRequest) {
  const token = getAuthToken(req);
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const decoded: any = jwt.decode(token);
  const userId = decoded?.sub;
  const url = `${API_GATEWAY}/progress/users/${userId}/overview?from=${from}&to=${to}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("❌ overview error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
