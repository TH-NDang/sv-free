import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Helper function to make variables optional in CI environment
const processEnv = <T extends z.ZodTypeAny>(schema: T) =>
  process.env.CI === "true" || process.env.NODE_ENV !== "production"
    ? schema.optional()
    : schema;

export const env = createEnv({
  client: {
    NEXT_PUBLIC_API_ENDPOINT: processEnv(z.string().url()),
    NEXT_PUBLIC_PROD_API_ENDPOINT: processEnv(z.string().url()),
    NEXT_PUBLIC_SUPABASE_URL: processEnv(z.string().url()),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: processEnv(z.string().min(1)),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: processEnv(z.string().min(1)),
  },
  runtimeEnv: {
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_PROD_API_ENDPOINT: process.env.NEXT_PUBLIC_PROD_API_ENDPOINT,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  },
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.NODE_ENV !== "production" ||
    process.env.CI === "true",
});
