import { Search } from "lucide-react";
import { Suspense } from "react";

import {
  CategoriesTable,
  CategoriesTableSkeleton,
} from "@/components/admin/categories/categories-table";
import {
  TagsTable,
  TagsTableSkeleton,
} from "@/components/admin/tags/tags-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getCategories, getTags } from "@/lib/mock/admin-data";
// import { getCategories } from "@/lib/db/queries";
// import { getTags } from "@/lib/db/queries";

interface AdminContentProps {
  tab: string;
  documents: unknown[];
  searchTerm?: string;
  DocumentsTable: React.ComponentType<{ documents: unknown[] }>;
  DocumentsTableSkeleton: React.ComponentType;
}

export async function AdminContent({
  tab,
  documents,
  searchTerm,
  DocumentsTable,
  DocumentsTableSkeleton,
}: AdminContentProps) {
  let title = "All Documents";
  let searchPlaceholder = "Search documents...";

  if (tab === "categories") {
    title = "All Categories";
    searchPlaceholder = "Search categories...";
  } else if (tab === "tags") {
    title = "All Tags";
    searchPlaceholder = "Search tags...";
  }

  return (
    <Card>
      <CardHeader className="px-6 pb-4 pt-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <CardTitle>{title}</CardTitle>
          <div className="flex w-full max-w-sm items-center space-x-2">
            <form className="flex w-full items-center space-x-2">
              <Input
                placeholder={searchPlaceholder}
                className="h-9"
                name="search"
                defaultValue={searchTerm}
              />
              <Button
                type="submit"
                size="sm"
                variant="ghost"
                className="h-9 px-2"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {tab === "documents" && (
          <Suspense fallback={<DocumentsTableSkeleton />}>
            <DocumentsTable documents={documents} />
          </Suspense>
        )}
        {tab === "categories" && (
          <Suspense fallback={<CategoriesTableSkeleton />}>
            <CategoriesTableContent />
          </Suspense>
        )}
        {tab === "tags" && (
          <Suspense fallback={<TagsTableSkeleton />}>
            <TagsTableContent />
          </Suspense>
        )}
      </CardContent>
    </Card>
  );
}

async function CategoriesTableContent() {
  const categories = await getCategories();
  // @ts-expect-error just for testing
  return <CategoriesTable categories={categories} />;
}

async function TagsTableContent() {
  const tags = await getTags();
  // @ts-expect-error just for testing
  return <TagsTable tags={tags} />;
}
