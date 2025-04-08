"use client";

import { Loader2, SearchIcon } from "lucide-react";
import { FormEvent } from "react";

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
import type { Category } from "@/lib/db/queries";

interface SearchFiltersProps {
  query: string;
  category: string;
  fileType: string;
  sortBy: string;
  dateRange: string;
  categoriesData: Category[] | undefined;
  uniqueFileTypes: string[] | undefined;
  isLoadingCategories: boolean;
  isLoadingFileTypes: boolean;
  errorCategories: Error | null;
  errorFileTypes: Error | null;
  isFetchingSearch: boolean;
  searchParamsString: string; // Pass the string to check if filters are active
  handleSearch: (e: FormEvent<HTMLFormElement>) => void;
  handleReset: () => void;
}

export function SearchFilters({
  query,
  category,
  fileType,
  sortBy,
  dateRange,
  categoriesData,
  uniqueFileTypes,
  isLoadingCategories,
  isLoadingFileTypes,
  errorCategories,
  errorFileTypes,
  isFetchingSearch,
  searchParamsString,
  handleSearch,
  handleReset,
}: SearchFiltersProps) {
  return (
    <Card className="lg:sticky lg:top-6 lg:self-start">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Filters</CardTitle>
        <CardDescription>Refine your search results</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="space-y-4">
            {/* Search Input */}
            <div className="space-y-2">
              <Label htmlFor="search-query">Search</Label>
              <div className="relative">
                <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="search-query"
                  name="q"
                  placeholder="Search documents, authors..."
                  defaultValue={query}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Category Select */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" defaultValue={category}>
                <SelectTrigger
                  id="category"
                  disabled={isLoadingCategories || !!errorCategories}
                >
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingCategories ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : errorCategories ? (
                    <SelectItem value="error" disabled>
                      Error loading
                    </SelectItem>
                  ) : (
                    <>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categoriesData?.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* File Type Select */}
            <div className="space-y-2">
              <Label htmlFor="filetype">File Type</Label>
              <Select name="type" defaultValue={fileType}>
                <SelectTrigger
                  id="filetype"
                  disabled={isLoadingFileTypes || !!errorFileTypes}
                >
                  <SelectValue placeholder="Select file type" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingFileTypes ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : errorFileTypes ? (
                    <SelectItem value="error" disabled>
                      Error loading
                    </SelectItem>
                  ) : (
                    <>
                      <SelectItem value="all">All File Types</SelectItem>
                      {uniqueFileTypes?.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.toUpperCase()}
                        </SelectItem>
                      ))}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Date Range Select */}
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

            {/* Sort By Select */}
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

            {/* Advanced Filters (Example) */}
            <Accordion type="single" collapsible>
              <AccordionItem value="advanced">
                <AccordionTrigger className="text-sm font-medium">
                  Advanced Filters
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="verified" name="verified" />
                      <Label htmlFor="verified">Verified Resources Only</Label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              type="submit"
              className="flex-1"
              disabled={isFetchingSearch}
            >
              {isFetchingSearch && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Apply Filters
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="flex-1 sm:flex-none"
              disabled={isFetchingSearch || searchParamsString === ""}
            >
              Reset
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
