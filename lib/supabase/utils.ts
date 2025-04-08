"use server";

import { createClient } from "@supabase/supabase-js";

const supabase = await createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const getPublicUrl = async (
  path: string | null | undefined,
  bucket: string
) => {
  if (!path) return null;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data?.publicUrl || null;
};
