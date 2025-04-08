import { DownloadIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Document, User } from "@/lib/db/schema";

type DocumentWithOptionalAuthor = Pick<
  Document,
  | "id"
  | "title"
  | "description"
  | "fileUrl"
  | "fileType"
  | "fileSize"
  | "createdAt"
  | "thumbnailUrl"
  | "published"
  | "downloadCount"
> & { author?: User };

export function DocumentsGrid({
  documents,
}: {
  documents: DocumentWithOptionalAuthor[];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="bg-card group flex flex-col overflow-hidden rounded-lg border transition-shadow duration-200 hover:shadow-md"
        >
          <Link
            href={`/documents/${doc.id}`}
            className="relative block aspect-[16/10] w-full"
          >
            <Image
              src={doc.thumbnailUrl || ""}
              alt={doc.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              <div className="rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                {doc.fileType}
              </div>
              <div className="rounded bg-black/70 px-2 py-1 text-xs font-medium text-white">
                {doc.fileSize}
              </div>
            </div>
          </Link>

          <div className="flex flex-col p-4">
            <Link
              href={`/documents/${doc.id}`}
              className="line-clamp-1 text-base font-semibold hover:underline"
            >
              {doc.title}
            </Link>
            <div className="text-muted-foreground mt-1 text-sm">
              {doc.author?.name} •{" "}
              {new Date(doc.createdAt).toLocaleDateString("en-US", {
                month: "numeric",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-muted-foreground text-xs">
                {doc.downloadCount} downloads
              </div>
              <div className="flex gap-1">
                <Link href={`/documents/${doc.id}`}>
                  <button className="hover:bg-muted rounded-full p-1 transition-colors">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </Link>
                <Link href={`/documents/${doc.id}/download`}>
                  <button className="hover:bg-muted rounded-full p-1 transition-colors">
                    <DownloadIcon className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
