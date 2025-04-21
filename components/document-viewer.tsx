"use client";

import { PDFViewer } from "@/components/pdf-viewer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink, FileIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface DocumentViewerProps {
  fileUrl: string;
  fileType: string | null;
  title: string;
  thumbnailUrl?: string | null;
}

export function DocumentViewer({
  fileUrl,
  fileType,
  title,
  thumbnailUrl,
}: DocumentViewerProps) {
  const [isFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [fileUrl, fileType, title, thumbnailUrl]);

  const getFileExtension = () => {
    // Kiểm tra fileType trước
    const lowerFileType = fileType?.toLowerCase();

    if (fileType) {
      // Ưu tiên xử lý MIME types đã biết
      if (lowerFileType === "application/pdf") return "pdf";
      if (
        lowerFileType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      )
        return "docx";
      if (lowerFileType === "application/msword") return "doc";
      if (
        lowerFileType ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
        return "xlsx";
      if (lowerFileType === "application/vnd.ms-excel") return "xls";
      if (
        lowerFileType ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      )
        return "pptx";
      if (lowerFileType === "application/vnd.ms-powerpoint") return "ppt";
      if (lowerFileType === "text/plain") return "txt";

      // Fallback cho các MIME type khác
      if (lowerFileType?.includes("/")) {
        // Cố gắng lấy phần cuối sau dấu '/' làm extension
        // (có thể không chính xác cho mọi trường hợp)
        return lowerFileType.split("/").pop() || "";
      }
      // Nếu không phải dạng MIME type chuẩn, trả về giá trị gốc
      return lowerFileType;
    }

    // Nếu không có fileType, lấy từ URL
    const extension = fileUrl.split(".").pop()?.toLowerCase();
    return extension || "";
  };

  const extension = getFileExtension() || "";

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      console.error("Invalid URL:", url);
      setLoadError("URL tài liệu không hợp lệ");
      return false;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full animate-pulse">
        <Skeleton className="h-[500px] w-full rounded-lg" />
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24" />
        </div>
      </div>
    );
  }

  if (!isValidUrl(fileUrl)) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border p-10 text-center">
        <FileIcon className="text-muted-foreground mb-4 h-20 w-20" />
        <h3 className="mb-2 text-xl font-medium">{title}</h3>
        <p className="text-muted-foreground mb-6">
          Không thể tải tài liệu: URL không hợp lệ
        </p>
      </div>
    );
  }

  // Xử lý hiển thị theo định dạng file
  const renderViewer = () => {
    if (
      extension === "pdf" ||
      (fileType && fileType.toLowerCase() === "application/pdf")
    ) {
      return <PDFViewer url={fileUrl} />;
    }

    // Hiển thị hình ảnh
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension)) {
      return (
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-lg border">
          <Image
            src={fileUrl}
            alt={title}
            width={800}
            height={600}
            className="h-auto w-full object-contain"
            onError={() => {
              setLoadError("Không thể tải hình ảnh");
            }}
          />
        </div>
      );
    }

    // Các file Office và định dạng khác
    if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(extension)) {
      return <OfficeViewer fileUrl={fileUrl} fileType={extension} />;
    }

    // Video files
    if (["mp4", "webm", "ogg"].includes(extension)) {
      return (
        <div className="max-w-3xl overflow-hidden rounded-lg border">
          <video
            src={fileUrl}
            controls
            className="w-full"
            poster={thumbnailUrl || undefined}
          >
            Trình duyệt của bạn không hỗ trợ video HTML5.
          </video>
        </div>
      );
    }

    // Audio files
    if (["mp3", "wav", "ogg"].includes(extension)) {
      return (
        <div className="max-w-3xl overflow-hidden rounded-lg border p-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full">
              <FileIcon className="text-primary h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-muted-foreground text-sm">Tập tin âm thanh</p>
            </div>
          </div>
          <audio controls className="mt-4 w-full">
            <source src={fileUrl} type={`audio/${extension}`} />
            Trình duyệt của bạn không hỗ trợ audio HTML5.
          </audio>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center rounded-lg border p-10 text-center">
        <FileIcon className="text-muted-foreground mb-4 h-20 w-20" />
        <h3 className="mb-2 text-xl font-medium">{title}</h3>
        <p className="text-muted-foreground mb-6">
          {loadError ||
            `Định dạng ${extension.toUpperCase()} không hỗ trợ xem trực tiếp`}
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <a href={fileUrl} download>
              Tải xuống
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Mở trong tab mới
            </a>
          </Button>
        </div>

        {thumbnailUrl && (
          <div className="mt-6 max-w-xs overflow-hidden rounded-md border">
            <p className="bg-secondary p-2 text-center text-xs">
              Hình ảnh xem trước
            </p>
            <Image
              src={thumbnailUrl}
              alt={`${title} preview`}
              width={300}
              height={200}
              className="h-auto w-full object-contain"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`document-viewer ${isFullscreen ? "bg-background fixed inset-0 z-50 p-4" : ""}`}
    >
      {renderViewer()}
    </div>
  );
}

interface OfficeViewerProps {
  fileUrl: string;
  fileType?: string;
}

function OfficeViewer({ fileUrl }: OfficeViewerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [fallbackMode, setFallbackMode] = useState(false);

  // Microsoft Office Online Viewer
  const officeOnlineUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
  // Google Docs Viewer fallback
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    console.error("Failed to load Office Viewer, switching to Google Docs");
    setFallbackMode(true);
  };

  return (
    <div className="office-viewer relative h-[600px] w-full overflow-hidden rounded-lg border">
      {isLoading && (
        <div className="bg-card/80 absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="border-primary mb-2 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
            <p>Đang tải trình xem tài liệu...</p>
          </div>
        </div>
      )}

      <iframe
        src={fallbackMode ? googleDocsUrl : officeOnlineUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        title="Office Document"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
      >
        <p>
          Trình duyệt của bạn không hỗ trợ iframe.
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            Tải tài liệu
          </a>
        </p>
      </iframe>

      {fallbackMode && (
        <div className="bg-background/80 text-muted-foreground absolute bottom-2 left-2 rounded px-2 py-1 text-xs">
          Đang sử dụng Google Docs Viewer
        </div>
      )}
    </div>
  );
}
