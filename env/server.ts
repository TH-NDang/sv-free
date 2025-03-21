import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

// Helper function to make variables optional in CI environment
const processEnv = <T extends z.ZodTypeAny>(schema: T) =>
  process.env.CI === "true" || process.env.NODE_ENV !== "production"
    ? schema.optional()
    : schema;

export const env = createEnv({
  server: {
    DATABASE_URL: processEnv(z.string().url()),
    GOOGLE_CLIENT_ID: processEnv(z.string().min(1)),
    GOOGLE_CLIENT_SECRET: processEnv(z.string().min(1)),
    BETTER_AUTH_SECRET: processEnv(z.string().min(1)),
    BETTER_AUTH_URL: processEnv(z.string().url()),
  },
  experimental__runtimeEnv: process.env,
  skipValidation:
    !!process.env.SKIP_ENV_VALIDATION ||
    process.env.NODE_ENV !== "production" ||
    process.env.CI === "true",
});
