"use client";
import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { parseApiResponse, UnauthorizedError } from "@/lib/utils";
import type { User, CreateUserInput, UpdateUserInput } from "@/app/types";
import { toast } from "sonner";

const USERS_API_URL = "/api/users";

function useAuthErrorHandler() {
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

export function useGetUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("UserApi");
  const { handleAuthError } = useAuthErrorHandler();

  const fetchUsers = useCallback(async () => {
    setLoading(true);

    try {
      const data = await parseApiResponse<User[]>(
        await fetch(USERS_API_URL, { method: "GET" }),
      );
      setUsers(data);
      return data;
    } catch (err: unknown) {
      if (handleAuthError(err)) {
        return [];
      }
      const message =
        err instanceof Error ? err.message : "Failed to fetch users";
      toast.error(t(message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleAuthError, t]);

  return {
    users,
    loading,
    fetchUsers,
  };
}

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("UserApi");
  const { handleAuthError } = useAuthErrorHandler();

  const createUser = useCallback(
    async (payload: CreateUserInput) => {
      setLoading(true);

      try {
        const user = await parseApiResponse<User>(
          await fetch(USERS_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }),
        );
        toast.success(t("successCreated"));
        return user;
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          throw err;
        }
        const message =
          err instanceof Error ? err.message : "Failed to create user";
        toast.error(t(message));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, t],
  );

  return {
    loading,
    createUser,
  };
}

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("UserApi");
  const { handleAuthError } = useAuthErrorHandler();

  const updateUser = useCallback(
    async (payload: UpdateUserInput) => {
      setLoading(true);

      try {
        const user = await parseApiResponse<User>(
          await fetch(USERS_API_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }),
        );
        toast.success(t("successUpdated"));
        return user;
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          throw err;
        }
        const message =
          err instanceof Error ? err.message : "Failed to update user";
        toast.error(t(message));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, t],
  );

  return {
    loading,
    updateUser,
  };
}

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("UserApi");
  const { handleAuthError } = useAuthErrorHandler();

  const deleteUser = useCallback(
    async (id: string) => {
      setLoading(true);

      try {
        await parseApiResponse(
          await fetch(`${USERS_API_URL}?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
          }),
        );
        toast.success(t("successDeleted"));
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          throw err;
        }
        const message =
          err instanceof Error ? err.message : "Failed to delete user";
        toast.error(t(message));
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [handleAuthError, t],
  );

  return {
    loading,
    deleteUser,
  };
}
