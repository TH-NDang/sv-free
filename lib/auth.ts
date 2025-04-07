import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, oneTap } from "better-auth/plugins";

import { env as serverEnv } from "@/env/server";
import { env as clientEnv } from "@/env/client";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: clientEnv.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: serverEnv.GOOGLE_CLIENT_SECRET!,
    },
  },
  plugins: [oneTap(), admin()],
});
