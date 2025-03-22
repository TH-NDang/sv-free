import {
  IconEdit,
  IconFiles,
  IconPlus,
  IconSearch,
  IconTag,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { getTags } from "@/lib/db/queries/tags";
import { formatDate } from "@/lib/utils";

export default async function TagsPage() {
  const tags = await getTags();

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">Manage document tags</p>
        </div>
        <Button asChild>
          <Link href="/admin/tags/create">
            <IconPlus className="mr-2 h-4 w-4" />
            Add Tag
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="px-6 pb-4 pt-6">
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <CardTitle>All Tags</CardTitle>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <form className="flex w-full items-center space-x-2">
                <Input
                  placeholder="Search tags..."
                  className="h-9"
                  name="search"
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
          <Suspense fallback={<TagsTableSkeleton />}>
            <TagsTable tags={tags} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}

function TagsTable({ tags }) {
  if (tags.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
        <IconTag className="text-muted-foreground/50 h-10 w-10" />
        <h3 className="mt-4 text-lg font-semibold">No tags found</h3>
        <p className="text-muted-foreground mb-4 mt-2 text-sm">
          Add tags to better organize and filter documents
        </p>
        <Button asChild variant="outline">
          <Link href="/admin/tags/create">Add a new tag</Link>
        </Button>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Documents</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tags.map((tag) => (
          <TableRow key={tag.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <IconTag className="text-muted-foreground h-4 w-4" />
                <span className="font-medium">{tag.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">
                {tag.slug}
              </code>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <IconFiles className="text-muted-foreground h-3.5 w-3.5" />
                <span>{tag.documentCount}</span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-muted-foreground text-sm">
                {formatDate(tag.createdAt)}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/tags/${tag.id}`}>
                    <IconEdit className="mr-1 h-3.5 w-3.5" />
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  disabled={tag.documentCount > 0}
                  title={
                    tag.documentCount > 0
                      ? "Cannot delete tag with documents"
                      : "Delete tag"
                  }
                >
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

function TagsTableSkeleton() {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[150px]" />
              <Skeleton className="h-4 w-[100px]" />
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
