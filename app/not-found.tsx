import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <h2 className="mb-4 text-xl font-semibold">Trang không tồn tại</h2>
      <p className="text-muted-foreground mb-6">
        Rất tiếc, trang bạn đang tìm kiếm không tồn tại.
      </p>
      <Button asChild>
        <Link href="/">Quay lại trang chủ</Link>
      </Button>
    </div>
  );
}
