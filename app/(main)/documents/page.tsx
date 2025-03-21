"use client";

import {
  ArrowUpDownIcon,
  BookOpenIcon,
  ListFilterIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

import { DocumentsGrid } from "@/app/(main)/components/documents-grid";
import { DocumentsTable } from "@/app/(main)/components/documents-table";
import { generateSampleDocuments } from "@/app/(main)/types/document";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
// Generate sample documents (would be fetched from API in real app)
const allDocuments = generateSampleDocuments(50);

export default function DocumentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [view, setView] = useState<"grid" | "table">(
    searchParams.get("view") === "table" ? "table" : "grid"
  );

  // Get filter params from URL
  const searchQuery = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "recent";
  const fileType = searchParams.get("type") || "all";

  // Filters state
  const [showFilters, setShowFilters] = useState(false);

  // Apply filters
  const filteredDocuments = allDocuments.filter((doc) => {
    // Category filter
    if (
      categoryFilter !== "all" &&
      doc.category.toLowerCase() !== categoryFilter.toLowerCase()
    ) {
      return false;
    }

    // File type filter
    if (
      fileType !== "all" &&
      doc.fileType.toLowerCase() !== fileType.toLowerCase()
    ) {
      return false;
    }

    // Search query
    if (searchQuery) {
      const matchesSearch =
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.author.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
    }

    return true;
  });

  // Apply sorting
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "recent":
        return (
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
      case "popular":
        return b.downloadCount - a.downloadCount;
      case "title":
        return a.title.localeCompare(b.title);
      default:
        return (
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
    }
  });

  // Get unique categories and file types for filters
  const uniqueCategories = [
    ...new Set(allDocuments.map((doc) => doc.category)),
  ];
  const uniqueFileTypes = [...new Set(allDocuments.map((doc) => doc.fileType))];

  // Handle search submissions
  const handleSearch = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const searchValue = formData.get("q") as string;

      const params = new URLSearchParams(searchParams);
      if (searchValue) {
        params.set("q", searchValue);
      } else {
        params.delete("q");
      }

      router.push(`/documents?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Handle filter changes
  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams);

      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }

      router.push(`/documents?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Handle view change
  const handleViewChange = useCallback(
    (newView: "grid" | "table") => {
      setView(newView);
      const params = new URLSearchParams(searchParams);

      if (newView === "table") {
        params.set("view", "table");
      } else {
        params.delete("view");
      }

      router.push(`/documents?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Browse Documents
          </h1>
          <p className="text-muted-foreground text-sm">
            {searchQuery
              ? `Search results for "${searchQuery}" - ${filteredDocuments.length} documents found`
              : "Discover and download academic resources shared by students"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <ListFilterIcon className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewChange(view === "grid" ? "table" : "grid")}
          >
            <ArrowUpDownIcon className="mr-2 h-4 w-4" />
            {view === "grid" ? "Table View" : "Grid View"}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className={`space-y-4 ${showFilters ? "block" : "block md:hidden"}`}>
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-2 sm:flex-row"
        >
          <div className="relative flex-1">
            <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              type="search"
              name="q"
              placeholder="Search for documents, subjects, topics..."
              className="pl-9"
              defaultValue={searchQuery}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="category-filter"
              className="text-muted-foreground mb-1 block text-sm"
            >
              Category
            </label>
            <Select
              defaultValue={categoryFilter}
              onValueChange={(value) => updateFilter("category", value)}
            >
              <SelectTrigger id="category-filter">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category.toLowerCase()}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="file-type-filter"
              className="text-muted-foreground mb-1 block text-sm"
            >
              File Type
            </label>
            <Select
              defaultValue={fileType}
              onValueChange={(value) => updateFilter("type", value)}
            >
              <SelectTrigger id="file-type-filter">
                <SelectValue placeholder="All File Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All File Types</SelectItem>
                {uniqueFileTypes.map((type) => (
                  <SelectItem key={type} value={type.toLowerCase()}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="sort-by"
              className="text-muted-foreground mb-1 block text-sm"
            >
              Sort By
            </label>
            <Select
              defaultValue={sortBy}
              onValueChange={(value) => updateFilter("sort", value)}
            >
              <SelectTrigger id="sort-by">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="title">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Category tabs - simplified version for mobile */}
      <div className="overflow-auto md:hidden">
        <Tabs
          defaultValue={categoryFilter === "all" ? "all" : categoryFilter}
          onValueChange={(value) => updateFilter("category", value)}
        >
          <TabsList className="bg-card h-9 w-full justify-start">
            <TabsTrigger value="all" className="px-3 py-1.5">
              All
            </TabsTrigger>
            {uniqueCategories.slice(0, 5).map((category) => (
              <TabsTrigger
                key={category}
                value={category.toLowerCase()}
                className="px-3 py-1.5"
              >
                {category}
              </TabsTrigger>
            ))}
            {uniqueCategories.length > 5 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <SlidersHorizontalIcon className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Categories</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {uniqueCategories.slice(5).map((category) => (
                      <DropdownMenuItem
                        key={category}
                        onClick={() =>
                          updateFilter("category", category.toLowerCase())
                        }
                      >
                        {category}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </TabsList>
        </Tabs>
      </div>

      {/* Document listing */}
      <div className="min-h-[500px]">
        {sortedDocuments.length > 0 ? (
          view === "grid" ? (
            <DocumentsGrid documents={sortedDocuments} />
          ) : (
            <DocumentsTable documents={sortedDocuments} />
          )
        ) : (
          <div className="flex h-[400px] items-center justify-center rounded-lg border border-dashed">
            <div className="text-center">
              <BookOpenIcon className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
              <h3 className="text-lg font-medium">No documents found</h3>
              <p className="text-muted-foreground mt-1 max-w-md">
                {searchQuery
                  ? "Try different search terms or removing some filters"
                  : "Try selecting a different category or uploading a document"}
              </p>
              <Button className="mt-4" asChild>
                <Link href="/documents/upload">Upload a Document</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
