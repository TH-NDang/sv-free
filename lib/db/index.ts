import { auth } from "@/lib/auth";
import { drizzle } from "drizzle-orm/postgres-js";
import { headers } from "next/headers";
import postgres from "postgres";

export async function getDb() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Not authenticated");
  }

  const client = postgres(process.env.DATABASE_URL!, {
    connection: {
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
  });

  return drizzle(client);
}

// For non-authenticated queries
const client = postgres(process.env.DATABASE_URL!);
export const db = drizzle(client);
