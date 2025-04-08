"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback } from "react";

import { SearchFilters } from "@/components/search-filters";
import { SearchResults } from "@/components/search-results";
import type { Category, DocumentWithDetails } from "@/lib/db/queries";

export type DocumentSearchResult = DocumentWithDetails & {
  fileUrl: string | null;
  thumbnailUrl: string | null;
};

async function fetchCategories(): Promise<Category[]> {
  const response = await fetch("/api/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

async function fetchUniqueFileTypes(): Promise<string[]> {
  const response = await fetch("/api/file-types");
  if (!response.ok) {
    throw new Error("Failed to fetch file types");
  }
  return response.json();
}

async function fetchSearchResults(
  params: URLSearchParams
): Promise<{ documents: DocumentSearchResult[] }> {
  const response = await fetch(`/api/search?${params.toString()}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to fetch search results");
  }
  return response.json();
}

export default function AdvancedSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";
  const fileType = searchParams.get("type") || "all";
  const sortBy = searchParams.get("sort") || "relevance";
  const dateRange = searchParams.get("date") || "all";

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    error: errorCategories,
  } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: uniqueFileTypes,
    isLoading: isLoadingFileTypes,
    error: errorFileTypes,
  } = useQuery<string[]>({
    queryKey: ["uniqueFileTypes"],
    queryFn: fetchUniqueFileTypes,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: searchData,
    isLoading: isLoadingSearch,
    error: errorSearch,
    isFetching: isFetchingSearch,
  } = useQuery({
    queryKey: ["search", searchParamsString],
    queryFn: () => fetchSearchResults(searchParams),
    placeholderData: (previousData) => previousData,
  });

  const documents = searchData?.documents;

  const handleSearch = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const params = new URLSearchParams();

      const searchQuery = formData.get("q") as string;
      if (searchQuery) params.set("q", searchQuery);
      else params.delete("q");

      const categoryValue = formData.get("category") as string;
      if (categoryValue && categoryValue !== "all")
        params.set("category", categoryValue);
      else params.delete("category");

      const fileTypeValue = formData.get("type") as string;
      if (fileTypeValue && fileTypeValue !== "all")
        params.set("type", fileTypeValue);
      else params.delete("type");

      const sortValue = formData.get("sort") as string;
      if (sortValue && sortValue !== "relevance") params.set("sort", sortValue);
      else params.delete("sort");

      const dateValue = formData.get("date") as string;
      if (dateValue && dateValue !== "all") params.set("date", dateValue);
      else params.delete("date");

      router.push(`/search?${params.toString()}`, { scroll: false });
    },
    [router]
  );

  const handleReset = useCallback(() => {
    router.push("/search", { scroll: false });
  }, [router]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Advanced Search</h1>
        <p className="text-muted-foreground text-sm">
          Find the exact academic resources you need
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <SearchFilters
          query={query}
          category={category}
          fileType={fileType}
          sortBy={sortBy}
          dateRange={dateRange}
          categoriesData={categoriesData}
          uniqueFileTypes={uniqueFileTypes}
          isLoadingCategories={isLoadingCategories}
          isLoadingFileTypes={isLoadingFileTypes}
          errorCategories={errorCategories}
          errorFileTypes={errorFileTypes}
          isFetchingSearch={isFetchingSearch}
          searchParamsString={searchParamsString}
          handleSearch={handleSearch}
          handleReset={handleReset}
        />

        <SearchResults
          documents={documents}
          isLoading={isLoadingSearch}
          isFetching={isFetchingSearch}
          error={errorSearch}
          query={query}
          handleReset={handleReset}
        />
      </div>
    </div>
  );
}
