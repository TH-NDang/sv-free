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

export function getMimeType(extension: string): string {
  switch (extension) {
    case "pdf":
      return "application/pdf";
    case "doc":
    case "docx":
      return "application/msword";
    case "xls":
    case "xlsx":
      return "application/vnd.ms-excel";
    case "ppt":
    case "pptx":
      return "application/vnd.ms-powerpoint";
    case "txt":
      return "text/plain";
    case "zip":
      return "application/zip";
    default:
      return `application/${extension}`;
  }
}

/**
 * Normalizes file path by removing special characters, spaces, diacritics
 * and converting to a format that works well with cloud storage
 */
export function normalizeFilePath(path: string): string {
  if (!path) return path;

  // Split path into parts (directories and filename)
  const parts = path.split("/");
  const filename = parts.pop() || "";

  // Process filename - remove extension first
  const lastDotIndex = filename.lastIndexOf(".");
  const extension = lastDotIndex !== -1 ? filename.substring(lastDotIndex) : "";
  const nameWithoutExt =
    lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;

  // Normalize the name without extension
  const normalizedName = nameWithoutExt
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^\w.-]/g, "-") // Replace spaces and special chars
    .replace(/-+/g, "-") // Replace multiple consecutive hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
    .toLowerCase();

  // Rebuild the path
  const normalizedFilename = normalizedName + extension;
  return [...parts, normalizedFilename].join("/");
}
