import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { locales } from "@/i18n/request";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: "es",
});

export default withAuth(
  function middleware(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const path = req.nextUrl.pathname;

        const isAdminRoute = new RegExp(
          `^(/(${locales.join("|")}))?/admin`,
        ).test(path);
        const isLoginRoute = new RegExp(
          `^(/(${locales.join("|")}))?/admin/login`,
        ).test(path);

        if (isAdminRoute && !isLoginRoute) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  },
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
