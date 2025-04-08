"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  BookmarkIcon,
  CalendarIcon,
  DownloadIcon,
  EyeIcon,
  FileIcon,
  ShareIcon,
  UserIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

import { DocumentViewer } from "@/components/document-viewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentWithDetails } from "@/lib/db/queries";

type FetchedDocument = DocumentWithDetails & {
  fileUrl: string | null;
  thumbnailUrl: string | null;
};

const fetchDocument = async (id: string): Promise<FetchedDocument[]> => {
  const response = await fetch(`/api/documents/${id}`);

  if (!response.ok) {
    let errorMsg = "Không thể lấy thông tin tài liệu";
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorData.error || errorMsg;
    } catch {
      /* Ignore parsing error */
    }
    throw new Error(errorMsg);
  }

  return response.json();
};

const formatFileSize = (bytes: number | null | undefined) => {
  if (bytes === null || bytes === undefined || bytes === 0) return "N/A";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

function DocumentDetailSkeleton() {
  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="min-w-0">
            <Skeleton className="h-7 w-48 md:w-72" />
            <Skeleton className="mt-1.5 h-4 w-24" />
          </div>
        </div>
        <div className="flex w-full flex-wrap justify-start gap-2 md:w-auto md:justify-end">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-[130px] rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Skeleton className="min-h-[500px] w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-20">
          <Card>
            <CardContent className="p-4 md:p-6">
              <Skeleton className="mb-4 h-6 w-40" />
              <Separator className="mb-4" />
              <div className="flex flex-col gap-3 text-sm">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="flex items-center gap-1.5">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-20" />
                      </span>
                      <Skeleton className="h-4 w-28" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const {
    data: documentDataArray,
    isLoading,
    error,
    isError,
  } = useQuery<FetchedDocument[], Error>({
    queryKey: ["document", documentId],
    queryFn: () => fetchDocument(documentId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const document = documentDataArray?.[0];

  useEffect(() => {
    if (isError && error) {
      toast.error(error.message || "Không thể lấy thông tin tài liệu");
    }
    if (
      !isLoading &&
      !isError &&
      documentDataArray &&
      documentDataArray.length === 0
    ) {
      console.warn("Document fetch returned an empty array.");
    }
  }, [isError, error, isLoading, documentDataArray]);

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return <DocumentDetailSkeleton />;
  }

  if (isError || !document) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <FileIcon className="text-muted-foreground mb-4 h-16 w-16" />
        <h1 className="text-2xl font-bold">Không tìm thấy tài liệu</h1>
        <p className="text-muted-foreground mt-2 text-center">
          {error instanceof Error
            ? `Lỗi: ${error.message}`
            : "Tài liệu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."}
        </p>
        <Button onClick={handleGoBack} variant="outline" className="mt-6">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleGoBack}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
          <div className="min-w-0">
            <h1
              className="truncate text-xl font-bold md:text-2xl"
              title={document.title}
            >
              {document.title}
            </h1>
            {document.category && (
              <p className="text-muted-foreground text-sm">
                {document.category.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex w-full flex-wrap justify-start gap-2 md:w-auto md:justify-end">
          <Button variant="outline" size="sm" asChild>
            <a
              href={document.fileUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={
                !document.fileUrl ? "cursor-not-allowed opacity-50" : ""
              }
            >
              <EyeIcon className="mr-2 h-4 w-4" />
              Xem
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a
              href={document.fileUrl || "#"}
              download={document.originalFilename}
              className={
                !document.fileUrl ? "cursor-not-allowed opacity-50" : ""
              }
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Tải xuống ({formatFileSize(document.fileSize)})
            </a>
          </Button>
          <Button variant="outline" size="sm">
            {/* ! TODO: implement share */}
            <ShareIcon className="mr-2 h-4 w-4" />
            Chia sẻ
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            {/* ! TODO: implement bookmark */}
            <BookmarkIcon className="h-4 w-4" />
            <span className="sr-only">Bookmark</span>
          </Button>
        </div>
      </div>

      {/* Document details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <CardContent className="min-h-[500px] p-0">
              {document.fileUrl ? (
                <DocumentViewer
                  fileUrl={document.fileUrl}
                  fileType={document.fileType}
                  title={document.title}
                  thumbnailUrl={document.thumbnailUrl}
                />
              ) : (
                <div className="bg-muted/50 flex h-full min-h-[500px] items-center justify-center">
                  <p className="text-muted-foreground">
                    Preview không khả dụng.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-20">
          <Card>
            <CardContent className="p-4 md:p-6">
              <h3 className="mb-4 text-lg font-medium">Thông tin tài liệu</h3>
              <Separator className="mb-4" />
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <UserIcon className="h-4 w-4" /> Tác giả:
                  </span>
                  <span className="text-right font-medium">
                    {document.author?.name || "Không xác định"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4" /> Ngày tải lên:
                  </span>
                  <span className="text-right">
                    {new Date(document.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <FileIcon className="h-4 w-4" /> Loại file:
                  </span>
                  <span className="text-right">
                    {document.fileType?.split("/").pop()?.toUpperCase() ||
                      "Không xác định"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <FileIcon className="h-4 w-4" /> Kích thước:
                  </span>
                  <span className="text-right">
                    {formatFileSize(document.fileSize)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <DownloadIcon className="h-4 w-4" /> Lượt tải:
                  </span>
                  <span className="text-right">
                    {document.downloadCount ?? 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
