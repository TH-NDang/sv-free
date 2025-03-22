import {
  IconCategory,
  IconDownload,
  IconEdit,
  IconEye,
  IconEyeOff,
  IconFile,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { Suspense } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getDocumentCount, getDocuments } from "@/lib/db/queries/documents";
import { formatDate, truncate } from "@/lib/utils";

interface DocumentsPageProps {
  searchParams: {
    search?: string;
    category?: string;
    page?: string;
  };
}

export default async function DocumentsPage({
  searchParams,
}: DocumentsPageProps) {
  const { search, category, page = "1" } = searchParams;
  const pageNumber = parseInt(page, 10) || 1;
  const pageSize = 10;

  const documents = await getDocuments({
    searchTerm: search,
    categoryId: category,
    publishedOnly: false,
    limit: pageSize,
    offset: (pageNumber - 1) * pageSize,
  });

  const totalDocuments = await getDocumentCount({
    searchTerm: search,
    categoryId: category,
    publishedOnly: false,
  });

  const totalPages = Math.ceil(totalDocuments / pageSize);

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">
            Manage educational documents and resources
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/documents/create">
            <IconPlus className="mr-2 h-4 w-4" />
            Add Document
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="px-6 pb-4 pt-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <CardTitle>All Documents</CardTitle>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <form className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Search documents..."
                  className="h-9"
                  name="search"
                  defaultValue={search}
                />
                <Button
                  type="submit"
                  size="sm"
                  variant="ghost"
                  className="h-9 px-2"
                >
                  <IconSearch className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<DocumentsTableSkeleton />}>
            <DocumentsTable documents={documents} />
          </Suspense>
        </CardContent>
        <CardFooter className="flex items-center justify-between px-6 py-4">
          <div className="text-muted-foreground text-xs">
            Showing <strong>{documents.length}</strong> of{" "}
            <strong>{totalDocuments}</strong> documents
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={pageNumber}
              totalPages={totalPages}
              baseUrl={`/admin/documents?search=${search || ""}&category=${category || ""}`}
            />
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

function DocumentsTable({ documents }: { documents: Document[] }) {
  if (documents.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
        <IconFile className="text-muted-foreground/50 h-10 w-10" />
        <h3 className="mt-4 text-lg font-semibold">No documents found</h3>
        <p className="text-muted-foreground mb-4 mt-2 text-sm">
          Try adjusting your search or filter criteria
        </p>
        <Button asChild variant="outline">
          <Link href="/admin/documents/create">Add a new document</Link>
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Author</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Downloads</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {documents.map((doc) => (
          <TableRow key={doc.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <IconFile className="text-muted-foreground h-4 w-4" />
                <span className="font-medium">{truncate(doc.title, 40)}</span>
              </div>
            </TableCell>
            <TableCell>
              {doc.category ? (
                <Badge variant="outline" className="gap-1 font-normal">
                  <IconCategory className="h-3 w-3" />
                  {doc.category.name}
                </Badge>
              ) : (
                <span className="text-muted-foreground text-sm">
                  Uncategorized
                </span>
              )}
            </TableCell>
            <TableCell>
              <span className="text-sm">{doc.authorName || "Unknown"}</span>
            </TableCell>
            <TableCell>
              <Badge
                variant={doc.published ? "success" : "secondary"}
                className="gap-1"
              >
                {doc.published ? (
                  <>
                    <IconEye className="h-3 w-3" />
                    Published
                  </>
                ) : (
                  <>
                    <IconEyeOff className="h-3 w-3" />
                    Draft
                  </>
                )}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="flex items-center gap-1 text-sm">
                <IconDownload className="h-3 w-3" /> {doc.downloadCount || 0}
              </span>
            </TableCell>
            <TableCell>
              <span className="text-muted-foreground text-sm">
                {formatDate(doc.createdAt)}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/documents/${doc.id}`}>
                    <IconEdit className="mr-1 h-3.5 w-3.5" />
                    Edit
                  </Link>
                </Button>
                <Button size="sm" variant="ghost" className="text-destructive">
                  <IconTrash className="h-3.5 w-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function DocumentsTableSkeleton() {
  return (
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
}

function Pagination({
  currentPage,
  totalPages,
  baseUrl,
}: {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}) {
  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        asChild={currentPage > 1}
      >
        {currentPage > 1 ? (
          <Link href={`${baseUrl}&page=${currentPage - 1}`}>Previous</Link>
        ) : (
          "Previous"
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        asChild={currentPage < totalPages}
      >
        {currentPage < totalPages ? (
          <Link href={`${baseUrl}&page=${currentPage + 1}`}>Next</Link>
        ) : (
          "Next"
        )}
      </Button>
    </div>
  );
}
