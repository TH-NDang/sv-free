"use client";

import { DocumentEditForm } from "@/components/admin/documents/document-edit-form";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useState } from "react";

// interface EditDocumentPageProps {
//   params: {
//     id: string;
//   };
// }

export default function EditDocumentPage() {
  const params = useParams();
  const [open, setOpen] = useState(true);

  const { data: document, isLoading: isLoadingDocument } = useQuery({
    queryKey: ["document", params.id],
    queryFn: async () => {
      const response = await fetch(`/api/documents/${params.id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }
      return response.json();
    },
  });

  const { data: categoriesResult, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories?page=1&pageSize=100");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    },
  });

  if (isLoadingDocument || isLoadingCategories) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Document not found</h1>
          <p className="text-muted-foreground">
            The document you are looking for does not exist.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Edit Document</h1>
        <p className="text-muted-foreground">
          Update document information and settings
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <DocumentEditForm
          document={document}
          categories={categoriesResult?.data || []}
          open={open}
          onOpenChange={setOpen}
          onSuccess={() => (window.location.href = "/admin/documents")}
        />
      </div>
    </div>
  );
}
