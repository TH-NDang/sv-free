import { env } from "@/env/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names and resolves Tailwind CSS conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function absoluteUrl(path: string) {
  return `${env.NEXT_PUBLIC_API_ENDPOINT}${path}`;
}

export function formatDate(date: Date | string): string {
  if (!date) return "";

  const d = typeof date === "string" ? new Date(date) : date;

  // Format: MMM DD, YYYY (e.g., Jan 15, 2023)
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function truncate(text: string, length: number): string {
  if (!text) return "";
  if (text.length <= length) return text;

  return text.slice(0, length) + "...";
}

export function formatFileSize(bytes: number | string): string {
  if (!bytes) return "0 B";

  const bytesNum = typeof bytes === "string" ? parseInt(bytes, 10) : bytes;

  if (isNaN(bytesNum)) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let size = bytesNum;

  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }

  return `${size.toFixed(1)} ${units[i]}`;
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores, and hyphens with a single -
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing -
}

export function parseNumber(value: string | undefined): number | undefined {
  if (!value) return undefined;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? undefined : parsed;
}
