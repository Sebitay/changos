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

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  const isAdminRoute = new RegExp(`^(/(${locales.join("|")}))?/admin`).test(
    path,
  );
  const isLoginRoute = new RegExp(
    `^(/(${locales.join("|")}))?/admin/login`,
  ).test(path);

  if (isAdminRoute && !isLoginRoute) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
      const locale = getLocaleFromPath(path);
      const loginUrl = new URL(`/${locale}/admin/login`, req.url);
      loginUrl.searchParams.set("callbackUrl", `${path}${req.nextUrl.search}`);
      return NextResponse.redirect(loginUrl);
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
