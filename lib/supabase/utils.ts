"use server";

import { createClient } from "./server";

const supabase = await createClient();

export const getPublicUrl = async (
  path: string | null | undefined,
  bucket: string
) => {
  if (!path) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || null;
};
