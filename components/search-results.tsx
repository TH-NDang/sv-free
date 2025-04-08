"use client";

import { AlertTriangle, FileIcon } from "lucide-react";

import { DocumentsGrid } from "@/app/(main)/components/documents-grid";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { DocumentSearchResult } from "../app/(main)/search/page"; // Assuming type is exported from page.tsx or defined elsewhere

// Skeleton for the results grid (can be defined here or imported)
function DocumentsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-48 w-full rounded-lg" />
      ))}
    </div>
  );
}

interface SearchResultsProps {
  documents: DocumentSearchResult[] | undefined;
  isLoading: boolean;
  isFetching: boolean; // To show skeleton even during refetch? Or just use isLoading?
  error: Error | null;
  query: string;
  handleReset: () => void;
}

export function SearchResults({
  documents,
  isLoading,
  isFetching,
  error,
  query,
  handleReset,
}: SearchResultsProps) {
  return (
    <div className="lg:col-span-3">
      <div className="mb-4">
        <h2 className="text-lg font-medium">
          {isLoading || isFetching ? ( // Show skeleton while loading or fetching
            <Skeleton className="inline-block h-6 w-40" />
          ) : (
            <>
              {documents?.length ?? 0} results found
              {query ? ` for "${query}"` : ""}
            </>
          )}
        </h2>
      </div>

      {isLoading ? (
        <DocumentsGridSkeleton />
      ) : error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error instanceof Error
              ? error.message
              : "Could not load search results. Please try again."}
          </AlertDescription>
        </Alert>
      ) : documents && documents.length > 0 ? (
        // Provide a default empty array if documents is undefined but not loading/error
        <DocumentsGrid documents={documents ?? []} />
      ) : (
        <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
          <FileIcon className="text-muted-foreground mb-4 h-12 w-12" />
          <h3 className="mb-2 text-lg font-medium">No results found</h3>
          <p className="text-muted-foreground mb-4 max-w-md text-center">
            Try adjusting your search or filter criteria.
          </p>
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
