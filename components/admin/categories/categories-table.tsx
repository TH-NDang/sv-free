import {
  IconEdit,
  IconFiles,
  IconFolder,
  IconTrash,
} from "@tabler/icons-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
  slug: string;
  documentCount: number;
  createdAt: string | Date;
}

interface CategoriesTableProps {
  categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
        <IconFolder className="text-muted-foreground/50 h-10 w-10" />
        <h3 className="mt-4 text-lg font-semibold">No categories found</h3>
        <p className="text-muted-foreground mb-4 mt-2 text-sm">
          Add a category to organize your documents
        </p>
        <Button asChild variant="outline">
          <Link href="/admin/categories/create">Add a new category</Link>
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
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <IconFolder className="text-muted-foreground h-4 w-4" />
                <span className="font-medium">{category.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">
                {category.slug}
              </code>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                <IconFiles className="text-muted-foreground h-3.5 w-3.5" />
                <span>{category.documentCount}</span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-muted-foreground text-sm">
                {formatDate(category.createdAt)}
              </span>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/admin/categories/${category.id}`}>
                    <IconEdit className="mr-1 h-3.5 w-3.5" />
                    Edit
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive"
                  disabled={category.documentCount > 0}
                  title={
                    category.documentCount > 0
                      ? "Cannot delete category with documents"
                      : "Delete category"
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

export function CategoriesTableSkeleton() {
  return (
    <div className="p-6">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
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
