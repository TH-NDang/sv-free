"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useEffect } from "react";

export default function AdminError({
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
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <div className="mb-4 rounded-full bg-red-100 p-3 text-red-600">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h2 className="mb-2 text-2xl font-bold">Lỗi hệ thống</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Đã xảy ra lỗi trong trang quản trị. Vui lòng thử lại hoặc liên hệ đội hỗ
        trợ kỹ thuật.
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/admin")}
        >
          Quay lại Dashboard
        </Button>
        <Button onClick={() => reset()}>Thử lại</Button>
      </div>
    </div>
  );
}
