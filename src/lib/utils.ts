import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ApiErrorPayload } from "@/app/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class UnauthorizedError extends Error {
  constructor(message: string = "unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export async function parseApiResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("text/html")) {
    throw new UnauthorizedError("unauthorized");
  }

  if (response.ok) {
    return (await response.json()) as T;
  }

  let errorMessage = "error";

  try {
    const errorPayload = (await response.json()) as ApiErrorPayload;
    errorMessage = errorPayload.error ?? errorPayload.message ?? errorMessage;
  } catch {
    errorMessage = response.statusText || errorMessage;
  }

  if (response.status === 401) {
    throw new UnauthorizedError(errorMessage);
  }

  throw new Error(errorMessage);
}
