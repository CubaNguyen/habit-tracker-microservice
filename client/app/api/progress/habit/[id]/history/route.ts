import { NextRequest, NextResponse } from "next/server";

const API_GATEWAY = process.env.NEXT_PUBLIC_API_GATEWAY;

function getAuthToken(req: NextRequest) {
  return req.cookies.get("access_token")?.value;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const token = getAuthToken(req);
  if (!token)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const limit = searchParams.get("limit");

  const { id } = await context.params;

  let url = `${API_GATEWAY}/progress/habits/${id}/history`;

  const queries: string[] = [];
  if (from) queries.push(`from=${from}`);
  if (to) queries.push(`to=${to}`);
  if (limit) queries.push(`limit=${limit}`);

  if (queries.length > 0) url += "?" + queries.join("&");

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("❌ history error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
