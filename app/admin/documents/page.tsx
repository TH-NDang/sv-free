import { AdminContent } from "@/components/admin/doc-admin-page-content";
import { DocumentsTable } from "@/components/admin/documents/documents-table";
import { AdminTabNavigation } from "@/components/admin/tab-navigation";
import { Skeleton } from "@/components/ui/skeleton";

// interface DocPageProps {
//   searchParams: { [key: string]: string | string[] | undefined };
// }

// async function deleteDocument(id: string) {
//   const response = await fetch(`/api/documents/${id}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });

//   if (!response.ok) {
//     throw new Error("Failed to delete document");
//   }

//   return response.json();
// }

export default async function DocPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  // Convert searchParams to a regular object first
  const params = Object.fromEntries(
    Object.entries(searchParams).map(([key, value]) => [
      key,
      Array.isArray(value) ? value[0] : value,
    ])
  );

  const search = params.search;
  const category = params.category;
  const tab = params.tab || "documents";
  const sortBy = params.sortBy || "createdAt";
  const sortOrder = params.sortOrder || "desc";

  const DocumentsTableSkeleton = () => (
    <div className="p-6">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage documents, categories, and tags
          </p>
        </div>
        {/* <AdminActionButton tab={tab} /> */}
      </div>

      <div className="space-y-4">
        <AdminTabNavigation />

        <AdminContent
          tab={tab}
          DocumentsTable={(props) => (
            <DocumentsTable
              {...props}
              search={search}
              category={category}
              sortBy={sortBy}
              sortOrder={sortOrder}
            />
          )}
          DocumentsTableSkeleton={DocumentsTableSkeleton}
        />
      </div>
    </div>
  );
}
