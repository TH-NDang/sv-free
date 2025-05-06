"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-12 text-center">
      <h2 className="mb-4 text-2xl font-bold">Đã xảy ra lỗi!</h2>
      <p className="text-muted-foreground mb-6">
        Rất tiếc, đã có lỗi xảy ra. Vui lòng thử lại.
      </p>
      <Button onClick={() => reset()}>Thử lại</Button>
    </div>
  );
}
