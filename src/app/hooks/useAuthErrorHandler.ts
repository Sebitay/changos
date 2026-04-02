import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { UnauthorizedError } from "@/lib/utils";

export function useAuthErrorHandler() {
  const router = useRouter();
  const locale = useLocale();

  const handleAuthError = useCallback(
    (err: unknown) => {
      if (err instanceof UnauthorizedError) {
        router.push(`/${locale}/admin/login`);
        return true;
      }
      return false;
    },
    [router, locale],
  );

  return { handleAuthError };
}
