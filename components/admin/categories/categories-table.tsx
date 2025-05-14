"use client";

import { useQuery } from "@tanstack/react-query";
import { Edit, Files, Folder, Plus, Trash } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Pagination } from "@/components/admin/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "date-fns";
import { CategoryDocumentsDialog } from "./category-documents-dialog";
import { CategoryFormDialog } from "./category-form-dialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  documentCount: number;
  createdAt: string | Date;
}

interface CategoriesTableProps {
  onRefresh?: () => void;
}

export function CategoriesTable({ onRefresh }: CategoriesTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );

  const currentPage = Number(searchParams.get("categoryPage")) || 1;
  const sortBy = searchParams.get("categorySortBy") || "createdAt";
  const sortOrder = searchParams.get("categorySortOrder") || "desc";

  const {
    data: { data: categories = [], total = 0, totalPages = 1 } = {},
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["categories", currentPage, sortBy, sortOrder],
    queryFn: async () => {
      const response = await fetch(
        `/api/categories?page=${currentPage}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    },
  });

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("categoryPage", page.toString());
    params.set("categorySortBy", sortBy);
    params.set("categorySortOrder", sortOrder);
    router.push(`?${params.toString()}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      toast.success("Category deleted successfully");
      refetch();
      onRefresh?.();
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    }
  };

  const handleSuccess = () => {
    refetch();
    onRefresh?.();
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  if (isLoading) {
    return <CategoriesTableSkeleton />;
  }

  return (
    <div className="space-y-4 p-5">
      <div className="flex justify-end">
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {categories.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
          <Folder className="text-muted-foreground/50 h-10 w-10" />
          <h3 className="mt-4 text-lg font-semibold">No categories found</h3>
          <p className="text-muted-foreground mb-4 mt-2 text-sm">
            Add a category to organize your documents
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)} variant="outline">
            Add a new category
          </Button>
        </div>
      ) : (
        <Card className="overflow-x-auto p-5">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
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
                {categories.map((category: Category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Folder className="text-muted-foreground h-4 w-4" />
                        <button
                          onClick={() => setSelectedCategory(category)}
                          className="font-medium hover:underline"
                        >
                          {category.name}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-xs">
                        {category.slug}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Files className="text-muted-foreground h-3.5 w-3.5" />
                        <span>{category.documentCount}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-muted-foreground text-sm">
                        {formatDate(category.createdAt, "MMM d, yyyy")}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="mr-1 h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
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
                              <Trash className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the category.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(category.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-muted-foreground text-xs">
                  Showing <strong>{categories.length}</strong> of{" "}
                  <strong>{total}</strong> categories
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <CategoryFormDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        category={undefined}
        onSuccess={handleSuccess}
      />

      {editingCategory && (
        <CategoryFormDialog
          open={!!editingCategory}
          onOpenChange={(open) => !open && setEditingCategory(null)}
          category={editingCategory}
          onSuccess={handleSuccess}
        />
      )}

      <CategoryDocumentsDialog
        open={!!selectedCategory}
        onOpenChange={(open) => !open && setSelectedCategory(null)}
        categoryId={selectedCategory?.id || ""}
        categoryName={selectedCategory?.name || ""}
      />
    </div>
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
