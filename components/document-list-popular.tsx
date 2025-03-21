import { Document } from "@/app/(main)/types/document";
import { Button } from "@/components/ui/button";
import { BookOpenIcon, TrendingUpIcon } from "lucide-react";
import Link from "next/link";

export function DocumentListPopular({ documents }: { documents: Document[] }) {
  return (
    <div className="bg-card flex flex-col rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUpIcon className="text-primary h-5 w-5" />
          <h2 className="text-xl font-semibold">Most Popular</h2>
        </div>
        <Link href="/documents?sort=popular">
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>
      <div className="space-y-4">
        {documents.slice(0, 3).map((doc) => (
          <Link
            key={doc.id}
            href={`/documents/${doc.id}`}
            className="hover:bg-muted/50 group flex items-start gap-3 rounded-md p-2"
          >
            <div
              className={`bg-primary/10 flex h-10 w-10 items-center justify-center rounded`}
            >
              <BookOpenIcon className="text-primary h-5 w-5" />
            </div>
            <div className="flex-1 overflow-hidden">
              <h3 className="group-hover:text-primary truncate font-medium">
                {doc.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {doc.fileType} • {doc.downloadCount} downloads
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
