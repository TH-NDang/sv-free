"use client";

import { useQuery } from "@tanstack/react-query";
import { formatDate } from "date-fns";
import { FileText } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Document {
  id: string;
  title: string;
  createdAt: string;
  downloadCount: number;
  viewCount: number;
}

interface CategoryDocumentsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categoryId: string;
  categoryName: string;
}

export function CategoryDocumentsDialog({
  open,
  onOpenChange,
  categoryId,
  categoryName,
}: CategoryDocumentsDialogProps) {
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["category-documents", categoryId],
    queryFn: async () => {
      const response = await fetch(`/api/documents?categoryId=${categoryId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      const data = await response.json();
      return data.data;
    },
    enabled: open && !!categoryId,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Documents in {categoryName}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center">
            <FileText className="text-muted-foreground/50 h-10 w-10" />
            <h3 className="mt-4 text-lg font-semibold">No documents found</h3>
            <p className="text-muted-foreground mb-4 mt-2 text-sm">
              This category does not have any documents yet
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map((doc: Document) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.title}</TableCell>
                  <TableCell>
                    {formatDate(doc.createdAt, "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>{doc.downloadCount}</TableCell>
                  <TableCell>{doc.viewCount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
