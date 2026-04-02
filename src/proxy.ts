import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { locales } from "@/i18n/request";
import { ensureAuthenticated } from "@/lib/auth";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: "es",
});

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
    const authResult = await ensureAuthenticated(req);
    if (authResult instanceof Response) {
      return authResult;
    }
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
