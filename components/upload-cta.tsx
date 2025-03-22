import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

export function UploadCTA() {
  return (
    <div className="bg-muted mt-6 flex flex-col items-center justify-between gap-4 rounded-lg border p-6 sm:flex-row">
      <div>
        <h3 className="text-xl font-semibold">Share Your Knowledge</h3>
        <p className="text-muted-foreground">
          Help other students by uploading your study materials
        </p>
      </div>
      <Link href="/documents/upload">
        <Button size="lg">
          <PlusIcon className="mr-2 h-4 w-4" />
          Upload Document
        </Button>
      </Link>
    </div>
  );
}
