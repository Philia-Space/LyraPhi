import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { access_token, user } = body;

    if (!access_token) {
      return NextResponse.json(
        { success: false, error: "missing token" },
        { status: 400 }
      );
    }

    const response = NextResponse.json({ success: true, data: { user } });

    response.cookies.set("phi_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 86400, // 24 hours
    });

    return response;
  } catch {
    return NextResponse.json(
      { success: false, error: "invalid request" },
      { status: 400 }
    );
  }
}
