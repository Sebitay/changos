import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function ensureAuthenticated(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return null;
}
