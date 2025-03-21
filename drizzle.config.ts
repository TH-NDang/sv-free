import { defineConfig } from "drizzle-kit";
import { env } from "./env/server";

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
