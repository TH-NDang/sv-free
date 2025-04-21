"use server";

import { createClient } from "./server";

export const getPublicUrl = async (
  path: string | null | undefined,
  bucket: string
) => {
  if (!path) return null;
  const supabase = await createClient();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || null;
};
