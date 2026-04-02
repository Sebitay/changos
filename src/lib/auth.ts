import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import type { JWT } from "next-auth/jwt";
import { getPrismaClient } from "./prisma";

export async function ensureAuthenticated(
  request: NextRequest,
): Promise<JWT | NextResponse> {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (token.exp && Date.now() / 1000 >= Number(token.exp)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    const userId = token.sub;
    if (!userId) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const prisma = getPrismaClient();
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return token;
}
