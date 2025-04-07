"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function OneTap() {
  const router = useRouter();

  useEffect(() => {
    const initOneTap = async () => {
      await authClient.oneTap({
        onPromptNotification(notification) {
          console.log(notification);
        },
        fetchOptions: {
          onSuccess: () => {
            router.push("/");
          },
        },
      });
    };
    initOneTap();
  }, []);

  return null;
}
