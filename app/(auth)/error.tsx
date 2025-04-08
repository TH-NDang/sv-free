"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

export default function AuthError({
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
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="mb-4 rounded-full bg-amber-100 p-3 text-amber-600">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h2 className="mb-2 text-2xl font-bold">Lỗi xác thực</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Đã xảy ra lỗi trong quá trình xác thực. Vui lòng thử lại sau.
      </p>
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/">Quay lại trang chủ</Link>
        </Button>
        <Button onClick={() => reset()}>Thử lại</Button>
      </div>
    </div>
  );
}
