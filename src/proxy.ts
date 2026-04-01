import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "@/i18n/request";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: "es",
});

const DEFAULT_LOCALE = "es";

function getLocaleFromPath(pathname: string) {
  const pathParts = pathname.split("/");
  const maybeLocale = pathParts[1];

  if (locales.includes(maybeLocale)) {
    return maybeLocale;
  }

  return DEFAULT_LOCALE;
}

function stripLocalePrefix(pathname: string) {
  const parts = pathname.split("/");
  const maybeLocale = parts[1];

  if (locales.includes(maybeLocale)) {
    return `/${parts.slice(2).join("/")}`;
  }

  return pathname;
}

export default async function middleware(req: NextRequest) {
  const intlResponse = intlMiddleware(req);
  const path = req.nextUrl.pathname;
  const normalizedPath = stripLocalePrefix(path);

  const isAdminRoute =
    normalizedPath === "/admin" || normalizedPath.startsWith("/admin/");
  const isLoginRoute = normalizedPath === "/admin/login";

  if (isAdminRoute && !isLoginRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const locale = getLocaleFromPath(path);
      const loginUrl = new URL(`/${locale}/admin/login`, req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
