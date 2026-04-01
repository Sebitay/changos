import { useState, useCallback } from "react";
import { parseApiResponse } from "@/lib/utils";
import { User, CreateUserInput, UpdateSectionInput } from "@/app/types";

const USERS_API_URL = "/api/users";

export function useGetUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await parseApiResponse<User[]>(
        await fetch(USERS_API_URL, { method: "GET" }),
      );
      setUsers(data);
      return data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch users";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
  };
}

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (payload: CreateUserInput) => {
    setLoading(true);
    setError(null);

    try {
      return await parseApiResponse<User>(
        await fetch(USERS_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create user";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createUser,
  };
}

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = useCallback(async (payload: UpdateSectionInput) => {
    setLoading(true);
    setError(null);

    try {
      return await parseApiResponse<User>(
        await fetch(USERS_API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update user";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    updateUser,
  };
}

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await parseApiResponse(
        await fetch(`${USERS_API_URL}?id=${id}`, {
          method: "DELETE",
        }),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete user";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    deleteUser,
  };
}
