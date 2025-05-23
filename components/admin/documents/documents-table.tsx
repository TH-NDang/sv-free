"use client";

import { Pagination } from "@/components/admin/pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DocumentWithDetails } from "@/lib/db/queries";
import { formatDate } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { DocumentEditForm } from "./document-edit-form";

async function deleteDocument(id: string) {
  try {
    const response = await fetch(`/api/documents/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete document");
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}

async function fetchDocuments({
  search,
  category,
  page,
  pageSize,
  sortBy = "createdAt",
  sortOrder = "desc",
}: {
  search?: string;
  category?: string;
  page: number;
  pageSize: number;
  sortBy?: string;
  sortOrder?: string;
}) {
  const searchParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(search && { search }),
    ...(category && { categoryId: category }),
    sortBy,
    sortOrder,
  });

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
  const response = await fetch(
    `${baseUrl}/api/documents?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return response.json();
}

interface DocumentsTableProps {
  search?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function DocumentsTable({
  search,
  category,
  sortBy = "createdAt",
  sortOrder = "desc",
}: DocumentsTableProps) {
  const router = useRouter();
  const [editingDocument, setEditingDocument] =
    useState<DocumentWithDetails | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories/all");
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    },
  });

  const { data: documentsData, isLoading } = useQuery({
    queryKey: [
      "documents",
      search,
      category,
      currentPage,
      pageSize,
      sortBy,
      sortOrder,
    ],
    queryFn: () =>
      fetchDocuments({
        search,
        category,
        page: currentPage,
        pageSize,
        sortBy,
        sortOrder,
      }),
  });

  const documents = documentsData?.data || [];
  const total = documentsData?.total || 0;
  const totalPages = documentsData?.totalPages || 0;

  const handleUpdate = (doc: DocumentWithDetails) => {
    setIsCreating(false);
    setEditingDocument(doc);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingDocument({
      id: "",
      title: "",
      description: "",
      originalFilename: "",
      storagePath: "",
      fileType: "",
      fileSize: 0,
      thumbnailStoragePath: "",
      categoryId: "",
      authorId: "",
      published: true,
      downloadCount: 0,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: null,
      author: null,
    } as DocumentWithDetails);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      try {
        await deleteDocument(id);
        toast.success("Document deleted successfully");
        router.refresh();
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to delete document"
        );
      }
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-4 p-5">
        <div className="mb-0 flex justify-end">
          <Button onClick={handleCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Document
          </Button>
        </div>
        <Card>
          <CardContent className="p-5">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Downloads</TableHead>
                  <TableHead>Views</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc: DocumentWithDetails) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>{doc.author?.name || "Unknown"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          doc.published
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {doc.published ? "Published" : "Draft"}
                      </span>
                    </TableCell>
                    <TableCell>{doc.downloadCount}</TableCell>
                    <TableCell>{doc.viewCount}</TableCell>
                    <TableCell>{formatDate(doc.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdate(doc)}
                        >
                          Update
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-muted-foreground text-xs">
                  Showing <strong>{documents.length}</strong> of{" "}
                  <strong>{total}</strong> documents
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {editingDocument && (
        <DocumentEditForm
          document={editingDocument}
          categories={categories || []}
          open={!!editingDocument}
          onOpenChange={(open) => {
            if (!open) {
              setEditingDocument(null);
              setIsCreating(false);
            }
          }}
          onSuccess={() => router.refresh()}
          title={isCreating ? "Create Document" : "Update Document"}
        />
      )}
    </>
  );
}
