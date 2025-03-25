import { drizzle } from "drizzle-orm/node-postgres";
import postgres from "postgres";

import { env } from "@/env/server";

const client = postgres(env.DATABASE_URL!);
export const db = drizzle({ client });
