import { DocumentWithDetails } from "@/lib/db/queries";
import { DownloadIcon, EyeIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatFileSize } from "@/lib/utils";

interface DocumentsGridProps {
  documents: (DocumentWithDetails & {
    fileUrl: string | null;
    thumbnailUrl: string | null;
  })[];
}

export function DocumentsGrid({ documents }: DocumentsGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {documents.map((doc) => (
        <div
          key={doc.id}
          className="bg-card group flex flex-col overflow-hidden rounded-lg border transition-shadow duration-200 hover:shadow-md"
        >
          <Link
            href={`/documents/${doc.id}`}
            className="relative block aspect-[16/10] w-full bg-gray-200"
          >
            {doc.thumbnailUrl ? (
              <Image
                src={doc.thumbnailUrl}
                alt={doc.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-sm text-gray-500">No preview</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute right-2 top-2 flex items-center gap-1">
              {doc.fileType && (
                <div className="rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
                  {doc.fileType.split("/").pop()?.toUpperCase() || doc.fileType}
                </div>
              )}
              {doc.fileSize !== null && doc.fileSize !== undefined && (
                <div className="rounded bg-black/70 px-1.5 py-0.5 text-xs font-medium text-white">
                  {formatFileSize(doc.fileSize)}
                </div>
              )}
            </div>
          </Link>

          <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
            <div>
              <Link
                href={`/documents/${doc.id}`}
                className="line-clamp-2 text-sm font-semibold leading-tight hover:underline sm:text-base"
                title={doc.title}
              >
                {doc.title}
              </Link>
              <div className="text-muted-foreground mt-1.5 flex items-center gap-1.5 text-xs">
                {doc.author ? (
                  <>
                    <span>{doc.author.name || "Unknown Author"}</span>
                  </>
                ) : (
                  <span>Unknown Author</span>
                )}
                <span>•</span>
                <span>
                  {new Date(doc.createdAt).toLocaleDateString("en-CA")}
                </span>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t pt-3">
              <div className="text-muted-foreground flex items-center gap-1 text-xs">
                <DownloadIcon className="h-3.5 w-3.5" />
                <span>{doc.downloadCount ?? 0}</span>
              </div>
              <div className="flex gap-1">
                <Link href={`/documents/${doc.id}`}>
                  <button
                    title="View Details"
                    className="text-muted-foreground hover:text-primary rounded-full p-1 transition-colors"
                  >
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </Link>
                <a
                  href={doc.fileUrl || "#"}
                  download={doc.originalFilename}
                  title="Download File"
                  className={`rounded-full p-1 transition-colors ${doc.fileUrl ? "text-muted-foreground hover:text-primary" : "cursor-not-allowed text-gray-400"}`}
                  onClick={(e) => !doc.fileUrl && e.preventDefault()}
                >
                  <DownloadIcon className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
