import { createAuthClient } from "better-auth/react";

import { oneTapClient } from "better-auth/client/plugins";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT!,
  plugins: [
    oneTapClient({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      // Optional client configuration:
      autoSelect: true,
      cancelOnTapOutside: true,
      additionalOptions: {
        // Any extra options for the Google initialize method
        shape: "circle",
      },
      promptOptions: {
        maxAttempts: 5, // Maximum number of attempts before triggering onPromptNotification (default: 5)
      },
    }),
    adminClient(),
  ],
});
