import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApiErrorPayload } from "@/app/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function parseApiResponse<T>(response: Response): Promise<T> {
  if (response.ok) {
    return (await response.json()) as T;
  }

  let errorMessage = "Request failed";

  try {
    const errorPayload = (await response.json()) as ApiErrorPayload;
    errorMessage = errorPayload.error ?? errorPayload.message ?? errorMessage;
  } catch {
    errorMessage = response.statusText || errorMessage;
  }

  throw new Error(errorMessage);
}
