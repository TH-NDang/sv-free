"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function SearchError({
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
      <h2 className="mb-4 text-2xl font-bold">Lỗi tìm kiếm</h2>
      <p className="text-muted-foreground mb-6">
        Đã xảy ra lỗi khi thực hiện tìm kiếm. Vui lòng thử lại sau.
      </p>
      <Button onClick={() => reset()}>Thử lại</Button>
    </div>
  );
}
