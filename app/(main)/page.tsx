"use client";

import {
  ClockIcon,
  FolderIcon,
  ListIcon,
  PlusIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { DocumentsGrid } from "@/app/(main)/components/documents-grid";
import { generateSampleDocuments } from "@/app/(main)/types/document";
import { Button } from "@/components/ui/button";
import { DocumentsTable } from "./components/documents-table";

// Generate sample documents
const documents = generateSampleDocuments(20);

export default function DocumentLibraryPage() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<"grid" | "table">("grid");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Get search query from URL params
  const searchQuery = searchParams.get("q") || "";

  // Filter documents based on search query and/or category
  const filteredDocuments = documents.filter((doc) => {
    // First check category filter
    const matchesCategory =
      activeCategory === "all" ||
      doc.category.toLowerCase() === activeCategory.toLowerCase();

    // If no search query, just return category matches
    if (!searchQuery) return matchesCategory;

    // Otherwise, check if document matches search query and category
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Get recent documents (last 5)
  const recentDocuments = [...documents]
    .sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
    .slice(0, 5);

  // Get popular documents (top 5 by download count)
  const popularDocuments = [...documents]
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 5);

  const uniqueCategories = [...new Set(documents.map((doc) => doc.category))];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Document Library
          </h1>
          <p className="text-muted-foreground">
            {searchQuery
              ? `Search results for "${searchQuery}" - ${filteredDocuments.length} documents found`
              : "Search, browse and download your documents"}
          </p>
        </div>
        <Link href="/documents/upload">
          <Button className="mt-2 md:mt-0">
            <PlusIcon className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </Link>
      </div>

      {/* Category tabs */}
      <div className="flex overflow-auto pb-1">
        <div className="bg-card inline-flex h-10 items-center justify-center rounded-lg p-1">
          <Button
            variant={activeCategory === "all" ? "default" : "ghost"}
            className="rounded-md px-3"
            onClick={() => setActiveCategory("all")}
          >
            All Documents
          </Button>
          {uniqueCategories.map((category) => (
            <Button
              key={category}
              variant={
                activeCategory === category.toLowerCase() ? "default" : "ghost"
              }
              className="rounded-md px-3"
              onClick={() => setActiveCategory(category.toLowerCase())}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="bg-card flex flex-col rounded-lg border p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
              <FolderIcon className="text-primary h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Browse Documents</h3>
              <p className="text-muted-foreground mt-1">
                Browse through {filteredDocuments.length} documents in your
                library
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card flex flex-col rounded-lg border p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
              <ClockIcon className="text-primary h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Recent Documents</h3>
              <p className="text-muted-foreground mt-1">
                {recentDocuments.length} new documents added recently
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card flex flex-col rounded-lg border p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-lg">
              <TrendingUpIcon className="text-primary h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Popular Documents</h3>
              <p className="text-muted-foreground mt-1">
                {popularDocuments.length > 0
                  ? `${popularDocuments[0].title} is the most downloaded document`
                  : "No popular documents yet"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtering and view controls */}
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setView(view === "grid" ? "table" : "grid")}
        >
          {view === "grid" ? (
            <ListIcon className="mr-2 h-4 w-4" />
          ) : (
            <ListIcon className="mr-2 h-4 w-4" />
          )}
          {view === "grid" ? "Table View" : "Grid View"}
        </Button>
      </div>

      {/* Document listing */}
      <div className="min-h-[300px]">
        {filteredDocuments.length > 0 ? (
          view === "grid" ? (
            <DocumentsGrid documents={filteredDocuments} />
          ) : (
            <DocumentsTable documents={filteredDocuments} />
          )
        ) : (
          <div className="flex h-[300px] items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <h3 className="text-lg font-medium">No documents found</h3>
              <p className="text-muted-foreground mt-1">
                {searchQuery
                  ? "Try different search terms"
                  : "Try selecting a different category"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
