"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerPort = null;
}

interface PDFViewerProps {
  url: string;
}

export function PDFViewer({ url }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string>(url);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [, setIsLoading] = useState<boolean>(true);
  const [useGoogleViewer, setUseGoogleViewer] = useState<boolean>(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Đang tải PDF từ URL:", url);

    // Kiểm tra trước nếu URL có thể truy cập được
    const checkUrl = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(url, { method: "HEAD" });

        if (response.ok) {
          setPdfUrl(url);
          setUseGoogleViewer(false);
        } else {
          // Không thể truy cập trực tiếp, chuyển sang Google Docs
          setUseGoogleViewer(true);
          setPdfUrl(
            `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
          );
        }
      } catch (error) {
        console.error("Không thể kiểm tra URL:", error);
        // Lỗi khi kiểm tra, chuyển sang Google Docs
        setUseGoogleViewer(true);
        setPdfUrl(
          `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkUrl();
  }, [url]);

  // Xử lý phím tắt
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!viewerRef.current) return;

      // Chỉ xử lý phím khi viewer đang focus
      const isFocused =
        viewerRef.current.contains(document.activeElement) ||
        document.activeElement === document.body;

      if (!isFocused) return;

      switch (e.key) {
        case "ArrowRight":
          setPageNumber((prev) => Math.min(numPages, prev + 1));
          break;
        case "ArrowLeft":
          setPageNumber((prev) => Math.max(1, prev - 1));
          break;
        case "+":
          setScale((prev) => prev + 0.2);
          break;
        case "-":
          setScale((prev) => Math.max(0.5, prev - 0.2));
          break;
        case "r":
          setRotation((prev) => (prev + 90) % 360);
          break;
        case "f":
          toggleFullscreen();
          break;
        default:
          return;
      }

      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [numPages, toggleFullscreen]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    console.log("PDF đã tải thành công, số trang:", numPages);
    setNumPages(numPages);
    setLoadError(null);
    setIsLoading(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error("Lỗi khi tải PDF:", error);
    setLoadError(error.message);
    setIsLoading(false);

    // Thử dùng Google Docs Viewer như một fallback
    setUseGoogleViewer(true);
    setPdfUrl(
      `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`
    );
  }

  function toggleFullscreen() {
    setIsFullscreen(!isFullscreen);
  }

  function handlePageChange(newPage: number) {
    setPageNumber(Math.max(1, Math.min(numPages, newPage)));
  }

  function handleJumpToPage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    // Sửa lỗi TS bằng cách kiểm tra và chuyển đổi kiểu an toàn hơn
    const element = target.elements.namedItem("page-jump");
    const value = element instanceof HTMLInputElement ? element.value : "";
    const page = parseInt(value, 10);

    if (!isNaN(page) && page >= 1 && page <= numPages) {
      setPageNumber(page);
    }
  }

  function handleDownload() {
    // Tạo link tải xuống
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop() || "document.pdf";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  // Nếu sử dụng Google Docs Viewer
  if (useGoogleViewer) {
    return (
      <div className="w-full">
        <div className="mb-2 h-[600px] w-full overflow-hidden rounded-lg border">
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            frameBorder="0"
            title="PDF Viewer"
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground text-xs">
            Đang sử dụng Google Docs Viewer để hiển thị PDF
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            title="Tải xuống"
          >
            <Download className="mr-1 h-4 w-4" />
            Tải xuống
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={viewerRef}
      className={`pdf-viewer relative flex flex-col items-center ${
        isFullscreen
          ? "bg-background/95 fixed inset-0 z-50 p-4 backdrop-blur-sm"
          : ""
      }`}
      tabIndex={0}
    >
      <div className="bg-card mb-4 max-h-[600px] w-full overflow-auto rounded-lg border p-4">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex h-[500px] w-full items-center justify-center">
              <div className="text-center">
                <div className="border-primary mb-2 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
                <p>Đang tải PDF...</p>
              </div>
            </div>
          }
          error={
            <div className="flex h-[300px] w-full flex-col items-center justify-center">
              <p className="text-destructive mb-4">
                Không thể tải tệp PDF.{" "}
                {loadError || "Vui lòng kiểm tra liên kết."}
              </p>
              <div className="flex gap-2">
                <Button asChild variant="outline">
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    Xem PDF trong tab mới
                  </a>
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-1 h-4 w-4" />
                  Tải xuống
                </Button>
              </div>
            </div>
          }
          options={{
            cMapUrl: "https://unpkg.com/pdfjs-dist@3.4.120/cmaps/",
            cMapPacked: true,
            standardFontDataUrl:
              "https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/",
            disableAutoFetch: false, // Cho phép tự động tải nội dung
            useWorkerFetch: true, // Sử dụng worker cho việc fetch
            isEvalSupported: true, // Cho phép eval (cần thiết cho một số tính năng)
            useSystemFonts: true, // Sử dụng font hệ thống khi có thể
            enableXfa: true, // Hỗ trợ XFA forms nếu có
          }}
        >
          <Page
            pageNumber={pageNumber}
            scale={scale}
            rotate={rotation}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            loading={
              <div className="flex h-80 w-full items-center justify-center">
                <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
              </div>
            }
            error={
              <div className="flex h-80 w-full items-center justify-center">
                <p className="text-destructive">Lỗi tải trang PDF</p>
              </div>
            }
          />
        </Document>
      </div>

      {numPages > 0 && (
        <div className="flex w-full flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale((prev) => Math.max(0.5, prev - 0.2))}
                disabled={scale <= 0.5}
                title="Thu nhỏ (phím -)"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="w-14 text-center text-xs">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setScale((prev) => prev + 0.2)}
                title="Phóng to (phím +)"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setRotation((prev) => (prev - 90) % 360)}
                title="Xoay trái"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setRotation((prev) => (prev + 90) % 360)}
                title="Xoay phải (phím r)"
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={toggleFullscreen}
              title={
                isFullscreen
                  ? "Thoát toàn màn hình (phím f)"
                  : "Toàn màn hình (phím f)"
              }
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4" />
              ) : (
                <Maximize className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleDownload}
              title="Tải xuống PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pageNumber - 1)}
              disabled={pageNumber <= 1}
              title="Trang trước (phím ←)"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <form onSubmit={handleJumpToPage} className="flex items-center">
              <input
                type="number"
                name="page-jump"
                className="border-input focus:ring-ring w-12 rounded border bg-transparent px-2 py-1 text-center text-sm focus:outline-none focus:ring-1"
                defaultValue={pageNumber}
                min={1}
                max={numPages}
              />
              <span className="mx-1 text-sm">/ {numPages}</span>
            </form>

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(pageNumber + 1)}
              disabled={pageNumber >= numPages}
              title="Trang sau (phím →)"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {isFullscreen && (
        <div className="absolute bottom-4 right-4">
          <Button variant="outline" onClick={toggleFullscreen}>
            Thoát toàn màn hình
          </Button>
        </div>
      )}
    </div>
  );
}
