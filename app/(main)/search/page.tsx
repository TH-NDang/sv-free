"use client";

import { FileIcon, SearchIcon, SlidersHorizontalIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useState } from "react";

import { DocumentsGrid } from "@/app/(main)/components/documents-grid";
import { generateSampleDocuments } from "@/app/(main)/types/document";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Generate sample documents (in a real app, this would be fetched from an API)
const allDocuments = generateSampleDocuments(100);

export default function AdvancedSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Get search params
  const query = searchParams.get("q") || "";
  const category = searchParams.get("category") || "all";
  const fileType = searchParams.get("type") || "all";
  const sortBy = searchParams.get("sort") || "relevance";
  const dateRange = searchParams.get("date") || "all";

  // Filter documents
  const filteredDocuments = allDocuments.filter((doc) => {
    // Text search
    if (query) {
      const matchesQuery =
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.description.toLowerCase().includes(query.toLowerCase()) ||
        doc.author.toLowerCase().includes(query.toLowerCase());

      if (!matchesQuery) return false;
    }

    // Category filter
    if (
      category !== "all" &&
      doc.category.toLowerCase() !== category.toLowerCase()
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

    // Date range filter
    if (dateRange !== "all") {
      const uploadDate = new Date(doc.uploadDate);
      const now = new Date();

      switch (dateRange) {
        case "today":
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (uploadDate < today) return false;
          break;
        case "week":
          const lastWeek = new Date();
          lastWeek.setDate(now.getDate() - 7);
          if (uploadDate < lastWeek) return false;
          break;
        case "month":
          const lastMonth = new Date();
          lastMonth.setMonth(now.getMonth() - 1);
          if (uploadDate < lastMonth) return false;
          break;
        case "year":
          const lastYear = new Date();
          lastYear.setFullYear(now.getFullYear() - 1);
          if (uploadDate < lastYear) return false;
          break;
      }
    }

    return true;
  });

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return (
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
      case "popular":
        return b.downloadCount - a.downloadCount;
      case "az":
        return a.title.localeCompare(b.title);
      case "za":
        return b.title.localeCompare(a.title);
      case "relevance":
      default:
        // Relevance sorting (prioritize exact matches in title)
        if (query) {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          const queryLower = query.toLowerCase();

          // Check if title starts with query
          const aStartsWithQuery = aTitle.startsWith(queryLower);
          const bStartsWithQuery = bTitle.startsWith(queryLower);

          if (aStartsWithQuery && !bStartsWithQuery) return -1;
          if (!aStartsWithQuery && bStartsWithQuery) return 1;

          // Check if title includes query
          const aIncludesQuery = aTitle.includes(queryLower);
          const bIncludesQuery = bTitle.includes(queryLower);

          if (aIncludesQuery && !bIncludesQuery) return -1;
          if (!aIncludesQuery && bIncludesQuery) return 1;

          // Check if description includes query
          const aDescIncludes = a.description
            .toLowerCase()
            .includes(queryLower);
          const bDescIncludes = b.description
            .toLowerCase()
            .includes(queryLower);

          if (aDescIncludes && !bDescIncludes) return -1;
          if (!aDescIncludes && bDescIncludes) return 1;

          // Default to most recent
          return (
            new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
          );
        }

        // If no query, sort by date
        return (
          new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
        );
    }
  });

  // Get unique categories and file types
  const uniqueCategories = [
    ...new Set(allDocuments.map((doc) => doc.category)),
  ];
  const uniqueFileTypes = [...new Set(allDocuments.map((doc) => doc.fileType))];

  // Handle search form submission
  const handleSearch = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      // Build search params
      const params = new URLSearchParams();

      const searchQuery = formData.get("q") as string;
      if (searchQuery) params.set("q", searchQuery);

      const categoryValue = formData.get("category") as string;
      if (categoryValue && categoryValue !== "all")
        params.set("category", categoryValue);

      const fileTypeValue = formData.get("type") as string;
      if (fileTypeValue && fileTypeValue !== "all")
        params.set("type", fileTypeValue);

      const sortValue = formData.get("sort") as string;
      if (sortValue && sortValue !== "relevance") params.set("sort", sortValue);

      const dateValue = formData.get("date") as string;
      if (dateValue && dateValue !== "all") params.set("date", dateValue);

      router.push(`/search?${params.toString()}`);
    },
    [router]
  );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight">Advanced Search</h1>
        <p className="text-muted-foreground text-sm">
          Find the exact academic resources you need
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Search filters sidebar */}
        <Card className="lg:sticky lg:top-6 lg:self-start">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Filters</CardTitle>
            <CardDescription>Refine your search results</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search-query">Search</Label>
                  <div className="relative">
                    <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                    <Input
                      id="search-query"
                      name="q"
                      placeholder="Search for documents..."
                      defaultValue={query}
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" defaultValue={category}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {uniqueCategories.map((cat) => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="filetype">File Type</Label>
                  <Select name="type" defaultValue={fileType}>
                    <SelectTrigger id="filetype">
                      <SelectValue placeholder="Select file type" />
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

                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Added</Label>
                  <Select name="date" defaultValue={dateRange}>
                    <SelectTrigger id="date-range">
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Past Week</SelectItem>
                      <SelectItem value="month">Past Month</SelectItem>
                      <SelectItem value="year">Past Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sort-by">Sort By</Label>
                  <Select name="sort" defaultValue={sortBy}>
                    <SelectTrigger id="sort-by">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Most Relevant</SelectItem>
                      <SelectItem value="date">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                      <SelectItem value="az">A-Z</SelectItem>
                      <SelectItem value="za">Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Accordion type="single" collapsible>
                  <AccordionItem value="advanced">
                    <AccordionTrigger className="text-sm font-medium">
                      Advanced Filters
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="verified" name="verified" />
                            <Label htmlFor="verified">
                              Verified Resources Only
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="free" name="free" defaultChecked />
                            <Label htmlFor="free">Free Resources Only</Label>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>

              <Button type="submit" className="w-full">
                Apply Filters
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Search results */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium">
              {filteredDocuments.length} results found
              {query ? ` for "${query}"` : ""}
            </h2>
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <SlidersHorizontalIcon className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          {filteredDocuments.length > 0 ? (
            // @ts-expect-error temp for mock data
            <DocumentsGrid documents={sortedDocuments} />
          ) : (
            <div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed">
              <FileIcon className="text-muted-foreground mb-4 h-12 w-12" />
              <h3 className="mb-2 text-lg font-medium">No results found</h3>
              <p className="text-muted-foreground mb-4 max-w-md text-center">
                Try adjusting your search or filter criteria to find what
                you&apos;re looking for
              </p>
              <Button onClick={() => router.push("/search")}>
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
