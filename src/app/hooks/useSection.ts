"use client";
import { useCallback, useState } from "react";
import { parseApiResponse } from "@/lib/utils";
import type {
  CreateSectionInput,
  Section,
  UpdateSectionInput,
} from "@/app/types";

const SECTIONS_API_URL = "/api/sections";

export function useGetSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSections = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await parseApiResponse<Section[]>(
        await fetch(SECTIONS_API_URL, { method: "GET" }),
      );
      setSections(data);
      return data;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch sections";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    sections,
    loading,
    error,
    fetchSections,
  };
}

export function useCreateSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSection = useCallback(async (payload: CreateSectionInput) => {
    setLoading(true);
    setError(null);

    try {
      return await parseApiResponse<Section>(
        await fetch(SECTIONS_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to create section";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createSection,
  };
}

export function useUpdateSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateSection = useCallback(async (payload: UpdateSectionInput) => {
    setLoading(true);
    setError(null);

    try {
      return await parseApiResponse<Section>(
        await fetch(SECTIONS_API_URL, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update section";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    updateSection,
  };
}

export function useDeleteSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteSection = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      return await parseApiResponse<{ message: string }>(
        await fetch(`${SECTIONS_API_URL}?id=${encodeURIComponent(id)}`, {
          method: "DELETE",
        }),
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to delete section";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    deleteSection,
  };
}
