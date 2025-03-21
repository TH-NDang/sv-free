import { env } from "@/env/client";
import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for the entire app
export const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL || "",
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

// Storage bucket name for documents
export const DOCUMENTS_BUCKET = "documents";

// Function to upload a file to Supabase Storage
export async function uploadFile(file: File, path: string) {
  try {
    const { data, error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

// Function to get public URL for a file
export function getFileUrl(path: string) {
  const { data } = supabase.storage.from(DOCUMENTS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Function to delete a file
export async function deleteFile(path: string) {
  try {
    const { data, error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .remove([path]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

// Function to list files with a certain prefix
export async function listFiles(prefix: string = "") {
  try {
    const { data, error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .list(prefix);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
}
