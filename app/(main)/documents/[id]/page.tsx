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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Document {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  fileType: string | null;
  fileSize: string | null;
  categoryId: string | null;
  authorId: string | null;
  thumbnailUrl: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  downloadCount: string;
  author?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
  } | null;
}

const fetchDocument = async (id: string): Promise<Document> => {
  const response = await fetch(`/api/documents/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Không thể lấy thông tin tài liệu");
  }

  return response.json();
};

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;

  const {
    data: document,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryKey: ["document", documentId],
    queryFn: () => fetchDocument(documentId),
    retry: 1,
  });

  useEffect(() => {
    if (isError && error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Không thể lấy thông tin tài liệu"
      );
    }
  }, [isError, error]);

  const handleGoBack = () => {
    router.back();
  };

  if (isLoading) {
    return <DocumentDetailSkeleton />;
  }

  if (isError || !document) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <FileIcon className="text-muted-foreground h-16 w-16" />
        <h1 className="mt-4 text-2xl font-bold">Không tìm thấy tài liệu</h1>
        <p className="text-muted-foreground mt-2 text-center">
          {error instanceof Error
            ? `Lỗi: ${error.message}`
            : "Tài liệu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."}
        </p>
        <Button onClick={handleGoBack} className="mt-6">
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-6 p-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{document.title}</h1>
            <p className="text-muted-foreground">
              {document.category?.name || "Chưa phân loại"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <EyeIcon className="mr-2 h-4 w-4" />
              Xem
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={document.fileUrl} download>
              <DownloadIcon className="mr-2 h-4 w-4" />
              Tải xuống
            </a>
          </Button>
          <Button variant="outline" size="sm">
            <ShareIcon className="mr-2 h-4 w-4" />
            Chia sẻ
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <BookmarkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Document details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left side - document preview */}
        <div className="lg:col-span-2">
          <Card>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Xem trước</TabsTrigger>
                <TabsTrigger value="details">Chi tiết</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="min-h-[500px]">
                <DocumentViewer
                  fileUrl={document.fileUrl}
                  fileType={document.fileType}
                  title={document.title}
                  thumbnailUrl={document.thumbnailUrl}
                />
              </TabsContent>

              <TabsContent value="details">
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                      <div className="text-muted-foreground">Tiêu đề</div>
                      <div>{document.title}</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                      <div className="text-muted-foreground">Mô tả</div>
                      <div>{document.description || "Không có mô tả"}</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                      <div className="text-muted-foreground">Danh mục</div>
                      <div>{document.category?.name || "Chưa phân loại"}</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                      <div className="text-muted-foreground">Loại file</div>
                      <div>{document.fileType || "Không xác định"}</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                      <div className="text-muted-foreground">Kích thước</div>
                      <div>{document.fileSize || "Không xác định"}</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                      <div className="text-muted-foreground">Lượt tải</div>
                      <div>{document.downloadCount || "0"}</div>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Right side - document metadata */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">Thông tin tài liệu</h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <UserIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">Tác giả:</span>
                  <span className="ml-auto">
                    {document.author || "Không xác định"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">Ngày tải lên:</span>
                  <span className="ml-auto">
                    {new Date(document.createdAt).toLocaleDateString("vi-VN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FileIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">Loại file:</span>
                  <span className="ml-auto">
                    {document.fileType || "Không xác định"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <DownloadIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">Lượt tải:</span>
                  <span className="ml-auto">
                    {document.downloadCount || "0"}
                  </span>
                </div>

                <Separator />

                <div className="flex flex-col gap-2">
                  <h4 className="font-medium">Hành động</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="w-full">
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Tải xuống
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ShareIcon className="mr-2 h-4 w-4" />
                      Chia sẻ
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DocumentDetailSkeleton() {
  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="aspect-video w-full" />
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="mb-4 h-6 w-40" />
              <div className="flex flex-col gap-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="ml-auto h-4 w-32" />
                    </div>
                  ))}
                <Skeleton className="h-0.5 w-full" />
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
