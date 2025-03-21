"use client";

import {
  BookOpenIcon,
  ClockIcon,
  FolderIcon,
  PlusIcon,
  SearchIcon,
  TrendingUpIcon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { generateSampleDocuments } from "@/app/(main)/types/document";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Generate sample documents (in a real app, this would be fetched from an API)
const documents = generateSampleDocuments(20);

export default function HomePage() {
  const searchParams = useSearchParams();
  const setActiveCategory = useState<string>("all")[1];

  // Get search query from URL params
  const searchQuery = searchParams.get("q") || "";

  // Filter documents based on search query and/or category
  //   const filteredDocuments = documents.filter((doc) => {
  //     // First check category filter
  //     const matchesCategory =
  //       activeCategory === "all" ||
  //       doc.category.toLowerCase() === activeCategory.toLowerCase();

  //     // If no search query, just return category matches
  //     if (!searchQuery) return matchesCategory;

  //     // Otherwise, check if document matches search query and category
  //     const matchesSearch =
  //       doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       doc.author.toLowerCase().includes(searchQuery.toLowerCase());

  //     return matchesCategory && matchesSearch;
  //   });

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
      {/* Hero section with search */}
      <div className="bg-card flex flex-col items-center justify-center rounded-lg border p-8 text-center">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">
          Student Document Library
        </h1>
        <p className="text-muted-foreground mb-6 max-w-2xl">
          Find free academic resources, lecture notes, study guides, and more -
          shared by students, for students
        </p>

        <form
          action="/documents"
          className="flex w-full max-w-xl flex-col gap-2 sm:flex-row"
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
      </div>

      {/* Category tabs */}
      <div className="flex justify-center overflow-auto pb-1">
        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="bg-card h-10">
            <TabsTrigger value="all">All</TabsTrigger>
            {uniqueCategories.map((category) => (
              <TabsTrigger key={category} value={category.toLowerCase()}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Featured Content */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Recently Added */}
        <div className="bg-card flex flex-col rounded-lg border p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ClockIcon className="text-primary h-5 w-5" />
              <h2 className="text-xl font-semibold">Recently Added</h2>
            </div>
            <Link href="/documents?sort=recent">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {recentDocuments.slice(0, 3).map((doc) => (
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
                    {doc.category} • {doc.fileType}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Most Popular */}
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
            {popularDocuments.slice(0, 3).map((doc) => (
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
      </div>

      {/* Browse by Category */}
      <div className="mt-4">
        <h2 className="mb-4 text-2xl font-semibold">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {uniqueCategories.map((category) => (
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

      {/* Upload CTA */}
      <div className="bg-muted mt-6 flex flex-col items-center justify-between gap-4 rounded-lg border p-6 sm:flex-row">
        <div>
          <h3 className="text-xl font-semibold">Share Your Knowledge</h3>
          <p className="text-muted-foreground">
            Help other students by uploading your study materials
          </p>
        </div>
        <Link href="/documents/upload">
          <Button size="lg">
            <PlusIcon className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </Link>
      </div>
    </div>
  );
}
