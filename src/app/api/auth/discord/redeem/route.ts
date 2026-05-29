import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const backendURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

    const res = await fetch(`${backendURL}/api/auth/discord/redeem`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json(
      { success: false, error: "failed to redeem code" },
      { status: 500 }
    );
  }
}
