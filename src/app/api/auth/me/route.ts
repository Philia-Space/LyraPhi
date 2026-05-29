import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.cookies.get("phi_token")?.value;

  if (!token) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  try {
    const res = await fetch(`${backendURL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, data: data.data });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
