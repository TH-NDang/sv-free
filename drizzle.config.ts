import { defineConfig } from "drizzle-kit";
import { env } from "./env/server";

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
});
