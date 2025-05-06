import { createAuthClient } from "better-auth/react";

import { oneTapClient } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL!,
  plugins: [
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      autoSelect: true,
      cancelOnTapOutside: true,
      additionalOptions: {
        shape: "circle",
      },
      promptOptions: {
        maxAttempts: 5,
      },
    }),
    adminClient(),
  ],
});

export const { signIn, signOut, signUp, useSession } = authClient;
