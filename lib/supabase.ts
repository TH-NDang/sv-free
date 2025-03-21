import { createClient, SupabaseClient } from "@supabase/supabase-js";

// For environments without proper configuration (like CI), we want to provide a mock client
// that won't throw errors but also won't do anything real
const createSupabaseClient = (): SupabaseClient => {
  // Try to get environment variables - these imports will be replaced during bundling
  // Using dynamic imports would cause issues in the Next.js build process
  let supabaseUrl = "";
  let supabaseKey = "";

  try {
    // Dynamically access env vars to prevent build errors
    supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  } catch {
    // Handle missing environment variables
    console.warn("Supabase environment variables are missing");
  }

  // Only create a real client if we have both URL and key
  if (supabaseUrl && supabaseKey) {
    return createClient(supabaseUrl, supabaseKey);
  }

  // Return a dummy client for environments without proper configuration
  // This prevents runtime errors while allowing the app to build
  if (process.env.NODE_ENV !== "production") {
    console.warn("Creating mock Supabase client due to missing configuration");
  }

  // Mock client that implements the supabase interface but does nothing
  // Using type assertion to SupabaseClient to avoid implementing the entire interface
  // while still maintaining type safety for the methods we use
  return {
    storage: {
      from: () => ({
        upload: async () => ({ data: null, error: null }),
        remove: async () => ({ data: null, error: null }),
        list: async () => ({ data: [], error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
        createSignedUrl: async () => ({ data: { signedUrl: "" }, error: null }),
      }),
    },
  } as unknown as SupabaseClient;
};

// Create the client
export const supabase = createSupabaseClient();

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
