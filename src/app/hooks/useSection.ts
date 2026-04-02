"use client";
import { useCallback, useState } from "react";
import { parseApiResponse } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useAuthErrorHandler } from "@/app/hooks/useAuthErrorHandler";
import type {
  CreateSectionInput,
  Section,
  UpdateSectionInput,
} from "@/app/types";
import { toast } from "sonner";

const SECTIONS_API_URL = "/api/sections";

export function useGetSections() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const t = useTranslations("SectionApi");
  const { handleAuthError } = useAuthErrorHandler();

  const fetchSections = useCallback(async () => {
    setLoading(true);

    try {
      const data = await parseApiResponse<Section[]>(
        await fetch(SECTIONS_API_URL, { method: "GET" }),
      );
      setSections(data);
      return data;
    } catch (err: unknown) {
      if (handleAuthError(err)) {
        throw err;
      }
      const message =
        err instanceof Error ? err.message : "Failed to fetch sections";
      toast.error(t(message));
      throw err;
    } finally {
      setLoading(false);
    }
  }, [handleAuthError, t]);

  return {
    sections,
    loading,
    fetchSections,
  };
}

export function useCreateSection() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("SectionApi");
  const { handleAuthError } = useAuthErrorHandler();

  const createSection = useCallback(
    async (payload: CreateSectionInput) => {
      setLoading(true);

      try {
        const section = await parseApiResponse<Section>(
          await fetch(SECTIONS_API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }),
        );
        toast.success(t("successCreated"));
        return section;
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          throw err;
        }
        const message =
          err instanceof Error ? err.message : "Failed to create section";
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
    createSection,
  };
}

export function useUpdateSection() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("SectionApi");
  const { handleAuthError } = useAuthErrorHandler();

  const updateSection = useCallback(
    async (payload: UpdateSectionInput) => {
      setLoading(true);

      try {
        const section = await parseApiResponse<Section>(
          await fetch(SECTIONS_API_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }),
        );
        toast.success(t("successUpdated"));
        return section;
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          throw err;
        }
        const message =
          err instanceof Error ? err.message : "Failed to update section";
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
    updateSection,
  };
}

export function useDeleteSection() {
  const [loading, setLoading] = useState(false);
  const t = useTranslations("SectionApi");
  const { handleAuthError } = useAuthErrorHandler();

  const deleteSection = useCallback(
    async (id: string) => {
      setLoading(true);

      try {
        const result = await parseApiResponse<{ message: string }>(
          await fetch(`${SECTIONS_API_URL}?id=${encodeURIComponent(id)}`, {
            method: "DELETE",
          }),
        );
        toast.success(t("successDeleted"));
        return result;
      } catch (err: unknown) {
        if (handleAuthError(err)) {
          throw err;
        }
        const message =
          err instanceof Error ? err.message : "Failed to delete section";
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
    deleteSection,
  };
}
