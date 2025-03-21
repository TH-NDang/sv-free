import { Document } from "@/app/(main)/types/document";
import { FolderIcon } from "lucide-react";
import Link from "next/link";

interface CategoryGridProps {
  categories: string[];
  documents: Document[];
}

export function CategoryGrid({ categories, documents }: CategoryGridProps) {
  return (
    <div className="mt-4">
      <h2 className="mb-4 text-2xl font-semibold">Browse by Category</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category}
            href={`/documents?category=${category.toLowerCase()}`}
            className="bg-card hover:border-primary hover:bg-primary/5 flex flex-col items-center justify-center rounded-lg border p-6 text-center"
          >
            <FolderIcon className="text-primary mb-2 h-8 w-8" />
            <h3 className="font-medium">{category}</h3>
            <p className="text-muted-foreground text-sm">
              {documents.filter((d) => d.category === category).length}{" "}
              documents
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
