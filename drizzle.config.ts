import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./lib/db/schema",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
