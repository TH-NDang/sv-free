import { generateSampleDocuments } from "@/app/(main)/types/document";
import { CategoryGrid } from "@/components/category-grid";
import { CategoryTabs } from "@/components/category-tabs";
import { DocumentListPopular } from "@/components/document-list-popular";
import { DocumentListRecent } from "@/components/document-list-recent";
import { SearchForm } from "@/components/search-form";
import { UploadCTA } from "@/components/upload-cta";
import { siteConfig } from "@/config/site";
import type { Metadata } from "next";
import { Suspense } from "react";

export const experimental_ppr = true;

// Metadata được định nghĩa trực tiếp trong Server Component
export const metadata: Metadata = {
  title: "Trang chủ",
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    images: [
      {
        url: `${siteConfig.url}/opengraph-image.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
};

// Đây là Server Component (không có "use client")
export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  // Dữ liệu được tải ở Server
  const documents = generateSampleDocuments(20);
  const searchQuery = (await searchParams).q || "";

  // Xử lý dữ liệu ở Server
  const recentDocuments = [...documents]
    .sort(
      (a, b) =>
        new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
    .slice(0, 5);

  const popularDocuments = [...documents]
    .sort((a, b) => b.downloadCount - a.downloadCount)
    .slice(0, 5);

  const uniqueCategories = [...new Set(documents.map((doc) => doc.category))];

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      {/* Hero section with search */}
      <div className="bg-card flex flex-col items-center justify-center rounded-lg border p-4 text-center sm:p-8">
        <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-4xl">
          Student Document Library
        </h1>
        <p className="text-muted-foreground mb-4 max-w-2xl text-sm sm:mb-6 sm:text-base">
          Find free academic resources, lecture notes, study guides, and more -
          shared by students, for students
        </p>

        <Suspense fallback={<div>Loading search...</div>}>
          <SearchForm initialQuery={searchQuery} />
        </Suspense>
      </div>

      {/* Category tabs - Client Component */}
      <div className="-mx-4 flex justify-start overflow-auto px-4 pb-1 sm:mx-0 sm:justify-center sm:px-0">
        <Suspense fallback={<div>Loading categories...</div>}>
          <CategoryTabs categories={uniqueCategories} />
        </Suspense>
      </div>

      {/* Các Component con khác... */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        <DocumentListRecent documents={recentDocuments} />
        <DocumentListPopular documents={popularDocuments} />
      </div>

      <CategoryGrid categories={uniqueCategories} documents={documents} />

      <UploadCTA />
    </div>
  );
}
