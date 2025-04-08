import { CategoryGrid } from "@/components/category-grid";
import { CategoryTabs } from "@/components/category-tabs";
import { DocumentListPopular } from "@/components/document-list-popular";
import { DocumentListRecent } from "@/components/document-list-recent";
import { OneTap } from "@/components/one-tap";
import { SearchForm } from "@/components/search-form";
import { UploadCTA } from "@/components/upload-cta";
import { siteConfig } from "@/config/site";

import { getCategories, getDocuments } from "@/lib/db/queries";

import type { Metadata } from "next";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const experimental_ppr = true;

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

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const searchQueryPromise = searchParams.then((params) => params.q || "");
  const categoriesPromise = getCategories({ limit: 100 });
  const documentsPromise = getDocuments({ limit: 10 });

  const [searchQuery, allCategories, recentDocumentsData] = await Promise.all([
    searchQueryPromise,
    categoriesPromise,
    documentsPromise,
  ]);

  const categoryNames = allCategories.map((cat) => cat.name);

  const recentDocuments = recentDocumentsData.slice(0, 5);
  const popularDocuments = recentDocumentsData.slice(5, 10);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      {/* OneTap button - only show if user is not logged in */}
      {!session?.user && <OneTap />}
      {/* Hero section with search */}
      <div className="bg-card flex flex-col items-center justify-center rounded-lg border p-4 text-center sm:p-8">
        <h1 className="mb-2 text-2xl font-bold tracking-tight sm:text-4xl">
          Thư viện tài liệu Sinh viên
        </h1>
        <p className="text-muted-foreground mb-4 max-w-2xl text-sm sm:mb-6 sm:text-base">
          Tìm tài liệu học tập, ghi chú bài giảng, đề cương ôn tập miễn phí và
          hơn thế nữa - được chia sẻ bởi sinh viên, dành cho sinh viên.
        </p>

        {/* SearchForm still uses Suspense due to searchParams dependency */}
        <Suspense fallback={<div>Loading search...</div>}>
          <SearchForm initialQuery={searchQuery} />
        </Suspense>
      </div>

      {/* Category tabs - Use mapped category names */}
      <div className="-mx-4 flex justify-start overflow-auto px-4 pb-1 sm:mx-0 sm:justify-center sm:px-0">
        <Suspense fallback={<div>Loading categories...</div>}>
          <CategoryTabs categories={categoryNames} />
        </Suspense>
      </div>

      {/* Pass mapped document data to lists */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        <DocumentListRecent documents={recentDocuments} />
        <DocumentListPopular documents={popularDocuments} />
      </div>

      {/* Category grid - Pass both mapped category names and mapped documents */}
      <CategoryGrid
        categories={categoryNames}
        documents={recentDocumentsData}
      />

      <UploadCTA />
    </div>
  );
}
