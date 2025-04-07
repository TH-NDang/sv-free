"use client";

import { authClient } from "@/lib/auth-client";
import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import QueryProvider from "./query-provider";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={router.push}
      replace={router.replace}
      onSessionChange={() => router.refresh()}
      providers={["google"]}
      multiSession
      avatar
      uploadAvatar={async (file) => {
        const formData = new FormData();
        formData.append("avatar", file);

        const res = await fetch("/api/uploadAvatar", {
          method: "POST",
          body: formData,
        });
        const { data } = await res.json();

        return data.url;
      }}
      settingsUrl="/settings"
    >
      <QueryProvider>{children}</QueryProvider>
    </AuthUIProvider>
  );
}
