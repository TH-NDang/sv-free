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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Input } from "./ui/input";

// ----------------------------------------------------------------
// Docs reference: https://github.com/wojtekmaj/react-pdf#readme
// ----------------------------------------------------------------

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// ----------------------------------------------------------------
// Types
// ----------------------------------------------------------------

type ViewMode = "single" | "all";
type ZoomMode = "custom" | "popout" | "normal";

interface PDFPageProps {
  pageNumber: number;
  scale: number;
  rotate: number;
  isPopup?: boolean;
}

interface PDFPagesProps {
  numPages: number;
  scale: number;
  rotate: number;
  setPageRef?: (index: number) => (ref: HTMLDivElement | null) => void;
  isPopup?: boolean;
}

// ----------------------------------------------------------------
// Custom Hooks
// ----------------------------------------------------------------

/**
 * Hook để quản lý trạng thái URL PDF
 */
function usePdfUrl(initialUrl: string) {
  const [pdfUrl, setPdfUrl] = useState<string>(initialUrl);
  const [useGoogleViewer, setUseGoogleViewer] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const checkUrl = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(initialUrl, { method: "HEAD" });

        if (response.ok) {
          setPdfUrl(initialUrl);
          setUseGoogleViewer(false);
        } else {
          setUseGoogleViewer(true);
          setPdfUrl(
            `https://docs.google.com/viewer?url=${encodeURIComponent(initialUrl)}&embedded=true`
          );
        }
      } catch {
        setUseGoogleViewer(true);
        setPdfUrl(
          `https://docs.google.com/viewer?url=${encodeURIComponent(initialUrl)}&embedded=true`
        );
      } finally {
        setIsLoading(false);
      }
    };

    checkUrl();
  }, [initialUrl]);

  return {
    pdfUrl,
    useGoogleViewer,
    isLoading,
    loadError,
    setLoadError,
    setIsLoading,
  };
}

/**
 * Hook để quản lý trạng thái trang PDF
 */
function usePdfNavigation(
  numPages: number,
  viewMode: ViewMode,
  documentRef: React.RefObject<HTMLDivElement | null>,
  pagesRef: React.MutableRefObject<(HTMLDivElement | null)[]>
) {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageInputValue, setPageInputValue] = useState<string>("1");

  // Update page input when page number changes
  useEffect(() => {
    setPageInputValue(pageNumber.toString());
  }, [pageNumber]);

  // Theo dõi page hiện tại dựa trên vị trí cuộn
  useEffect(() => {
    if (viewMode === "all" && documentRef.current && numPages > 0) {
      const handleScroll = () => {
        if (!documentRef.current) return;

        // Tìm trang đang hiển thị dựa trên vị trí cuộn
        let visiblePage = 1;
        let closestDistance = Infinity;

        pagesRef.current.forEach((pageRef, index) => {
          if (pageRef) {
            const pageRect = pageRef.getBoundingClientRect();
            const containerRect = documentRef.current!.getBoundingClientRect();

            // Tính khoảng cách từ điểm giữa của container đến điểm giữa của trang
            const containerCenter =
              containerRect.top + containerRect.height / 2;
            const pageCenter = pageRect.top + pageRect.height / 2;
            const distance = Math.abs(containerCenter - pageCenter);

            if (distance < closestDistance) {
              closestDistance = distance;
              visiblePage = index + 1; // +1 vì index bắt đầu từ 0
            }
          }
        });

        if (visiblePage !== pageNumber) {
          setPageNumber(visiblePage);
        }
      };

      const container = documentRef.current;
      container.addEventListener("scroll", handleScroll);

      return () => {
        container.removeEventListener("scroll", handleScroll);
      };
    }
  }, [viewMode, numPages, pageNumber, documentRef, pagesRef]);

  function handlePageChange(newPage: number) {
    const page = Math.max(1, Math.min(numPages, newPage));
    setPageNumber(page);

    if (viewMode === "all") {
      scrollToPage(page);
    }
  }

  function scrollToPage(pageNum: number) {
    if (pageNum < 1 || pageNum > numPages || !documentRef.current) return;

    const targetPage = pagesRef.current[pageNum - 1];
    if (targetPage) {
      // Cuộn đến trang được chọn với hiệu ứng mượt
      targetPage.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function handlePageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPageInputValue(e.target.value);
  }

  function handlePageInputBlur() {
    const page = parseInt(pageInputValue, 10);
    if (!isNaN(page) && page >= 1 && page <= numPages) {
      handlePageChange(page);
    } else {
      setPageInputValue(pageNumber.toString());
    }
  }

  return {
    pageNumber,
    pageInputValue,
    handlePageChange,
    scrollToPage,
    handlePageInputChange,
    handlePageInputBlur,
  };
}

/**
 * Hook để quản lý thao tác bàn phím
 */
function useKeyboardControls(
  viewerRef: React.RefObject<HTMLDivElement | null>,
  numPages: number,
  pageNumber: number,
  handlePageChange: (page: number) => void,
  scrollToPage: (page: number) => void,
  viewMode: ViewMode,
  setScale: React.Dispatch<React.SetStateAction<number>>,
  setRotation: React.Dispatch<React.SetStateAction<number>>,
  toggleFullscreen: () => void,
  isFullscreen: boolean,
  zoomMode: ZoomMode,
  setZoomMode: React.Dispatch<React.SetStateAction<ZoomMode>>,
  toggleViewMode: () => void
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!viewerRef.current) return;

      const isFocused =
        viewerRef.current.contains(document.activeElement) ||
        document.activeElement === document.body;

      if (!isFocused) return;

      switch (e.key) {
        case "ArrowRight":
          if (viewMode === "single") {
            handlePageChange(pageNumber + 1);
          } else {
            scrollToPage(pageNumber + 1);
          }
          break;
        case "ArrowLeft":
          if (viewMode === "single") {
            handlePageChange(pageNumber - 1);
          } else {
            scrollToPage(pageNumber - 1);
          }
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
        case "Escape":
          if (zoomMode === "popout") setZoomMode("normal");
          if (isFullscreen) toggleFullscreen();
          break;
        case "v":
          toggleViewMode();
          break;
        default:
          return;
      }

      e.preventDefault();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    numPages,
    isFullscreen,
    zoomMode,
    pageNumber,
    viewMode,
    viewerRef,
    handlePageChange,
    scrollToPage,
    setScale,
    setRotation,
    toggleFullscreen,
    setZoomMode,
    toggleViewMode,
  ]);
}

// ----------------------------------------------------------------
// Sub-Components
// ----------------------------------------------------------------

/**
 * Component hiển thị một trang PDF
 */
function PDFSinglePage({
  pageNumber,
  scale,
  rotate,
  isPopup = false,
}: PDFPageProps) {
  return (
    <Page
      key={`page_${pageNumber}${isPopup ? "_popup" : ""}`}
      pageNumber={pageNumber}
      scale={isPopup ? scale * 1.5 : scale}
      rotate={rotate}
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
      className="mx-auto"
      width={undefined}
    />
  );
}

/**
 * Component hiển thị tất cả trang PDF
 */
function PDFMultiPage({
  numPages,
  scale,
  rotate,
  setPageRef,
  isPopup = false,
}: PDFPagesProps) {
  return (
    <>
      {Array.from(new Array(numPages), (el, index) => (
        <div
          key={`page_container_${index + 1}${isPopup ? "_popup" : ""}`}
          ref={setPageRef ? setPageRef(index) : undefined}
          className={`mb-${isPopup ? "8" : "4"} flex justify-center border-b border-gray-200 pb-${isPopup ? "8" : "4"} last:mb-0 last:border-b-0 last:pb-0`}
          id={`pdf-page-${index + 1}${isPopup ? "-popup" : ""}`}
        >
          <div className="relative">
            <div className="bg-primary/10 absolute -left-10 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium">
              {index + 1}
            </div>
            <Page
              key={`page_${index + 1}${isPopup ? "_popup" : ""}`}
              pageNumber={index + 1}
              scale={isPopup ? scale * 1.5 : scale}
              rotate={rotate}
              renderTextLayer={true}
              renderAnnotationLayer={true}
              className="mx-auto"
              width={undefined}
              loading={
                <div className="flex h-80 w-full items-center justify-center">
                  <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"></div>
                </div>
              }
            />
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * Component hiển thị toolbar điều khiển
 */
interface PDFToolbarProps {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
  rotation: number;
  setRotation: React.Dispatch<React.SetStateAction<number>>;
  pageNumber: number;
  numPages: number;
  pageInputValue: string;
  viewMode: ViewMode;
  handlePageChange: (page: number) => void;
  handlePageInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePageInputBlur: () => void;
  toggleViewMode: () => void;
  toggleZoomMode: () => void;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
}

function PDFToolbar({
  scale,
  setScale,
  rotation,
  setRotation,
  pageNumber,
  numPages,
  pageInputValue,
  viewMode,
  handlePageChange,
  handlePageInputChange,
  handlePageInputBlur,
  toggleViewMode,
  toggleZoomMode,
  toggleFullscreen,
  isFullscreen,
}: PDFToolbarProps) {
  return (
    <div className="bg-card flex w-full flex-wrap items-center justify-between gap-2 rounded-lg border p-2">
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

          <Button
            variant="outline"
            size="icon"
            onClick={toggleZoomMode}
            title="Xem chi tiết"
            className="ml-1"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setRotation((prev) => (prev - 90) % 360)}
            title={`Xoay trái (hiện tại: ${rotation}°)`}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setRotation((prev) => (prev + 90) % 360)}
            title={`Xoay phải (phím r) (hiện tại: ${rotation}°)`}
          >
            <RotateCw className="h-4 w-4" />
          </Button>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={toggleViewMode}
          title="Chuyển đổi chế độ xem (phím v)"
          className="ml-1"
        >
          {viewMode === "single" ? "Xem tất cả trang" : "Xem một trang"}
        </Button>

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
      </div>

      <div className="flex items-center gap-2">
        <div className="text-muted-foreground mr-2 hidden text-xs md:block">
          Phím tắt: ← → (chuyển trang), + - (phóng to/thu nhỏ), r (xoay), f
          (toàn màn hình), v (chuyển chế độ), ESC (thoát)
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber <= 1}
          title="Trang trước (phím ←)"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <div className="flex items-center">
          <Input
            type="number"
            value={pageInputValue}
            onChange={handlePageInputChange}
            onBlur={handlePageInputBlur}
            onKeyDown={(e) => e.key === "Enter" && handlePageInputBlur()}
            className="border-input focus:ring-ring w-12 rounded border bg-transparent px-2 py-1 text-center text-sm focus:outline-none focus:ring-1"
            min={1}
            max={numPages}
          />
          <span className="text-muted-foreground mx-1 text-sm">
            / {numPages}
          </span>
        </div>

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
  );
}

function GooglePDFViewer({ url }: { url: string }) {
  return (
    <div className="w-full">
      <div className="mb-2 h-[700px] w-full overflow-hidden rounded-lg border">
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
          width="100%"
          height="100%"
          title="PDF Viewer"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-muted-foreground text-xs">
          Đang sử dụng Google Docs Viewer để hiển thị PDF
        </div>
      </div>
    </div>
  );
}

/**
 * Interface for PDF document options
 */
interface PDFDocumentOptions {
  cMapUrl: string;
  cMapPacked: boolean;
  standardFontDataUrl: string;
}

/**
 * Component hiển thị modal xem chi tiết
 */
interface PDFPopupViewerProps {
  pdfUrl: string;
  documentOptions: PDFDocumentOptions;
  numPages: number;
  pageNumber: number;
  scale: number;
  handlePageChange: (page: number) => void;
  setZoomMode: React.Dispatch<React.SetStateAction<ZoomMode>>;
}

function PDFPopupViewer({
  pdfUrl,
  documentOptions,
  numPages,
  pageNumber,
  scale,
  handlePageChange,
  setZoomMode,
}: PDFPopupViewerProps) {
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setZoomMode("normal");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-background relative h-[90vh] w-[90vw] overflow-auto rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Thanh điều khiển cố định */}
        <div className="bg-card sticky top-0 z-50 flex w-full items-center justify-between border-b p-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            Xem chi tiết trang
            <span className="flex items-center gap-2">
              {/* ! TODO: fix not working */}
              <Input
                type="number"
                value={pageNumber}
                onChange={(e) => handlePageChange(parseInt(e.target.value))}
                className="w-12"
              />
              / {numPages}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setZoomMode("normal")}
              className="ml-2"
            >
              Đóng
            </Button>
          </div>
        </div>

        <div className="p-4">
          <Document file={pdfUrl} options={documentOptions}>
            <PDFMultiPage
              numPages={numPages}
              scale={scale}
              rotate={0}
              setPageRef={() => () => undefined}
              isPopup={true}
            />
          </Document>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------

export function PDFViewer({
  url,
  height = "700px",
}: {
  url: string;
  height?: string;
}) {
  // State
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [zoomMode, setZoomMode] = useState<ZoomMode>("normal");

  const viewerRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const pagesRef = useRef<(HTMLDivElement | null)[]>([]);

  const {
    pdfUrl,
    useGoogleViewer,
    isLoading,
    loadError,
    setLoadError,
    setIsLoading,
  } = usePdfUrl(url);

  // Memoize options object to prevent unnecessary re-renders
  const documentOptions = useMemo(
    () => ({
      cMapUrl: "https://unpkg.com/pdfjs-dist@3.4.120/cmaps/",
      cMapPacked: true,
      standardFontDataUrl:
        "https://unpkg.com/pdfjs-dist@3.4.120/standard_fonts/",
    }),
    []
  );

  // Callback để tham chiếu đến từng trang PDF
  const setPageRef = useCallback(
    (index: number) => (ref: HTMLDivElement | null) => {
      pagesRef.current[index] = ref;
    },
    []
  );

  // Quản lý điều hướng trang
  const {
    pageNumber,
    pageInputValue,
    handlePageChange,
    scrollToPage,
    handlePageInputChange,
    handlePageInputBlur,
  } = usePdfNavigation(numPages, viewMode, documentRef, pagesRef);

  function toggleFullscreen() {
    setIsFullscreen(!isFullscreen);
    if (zoomMode === "popout") setZoomMode("normal");
  }

  function toggleViewMode() {
    setViewMode(viewMode === "single" ? "all" : "single");
  }

  function toggleZoomMode() {
    if (zoomMode === "normal") {
      setZoomMode("popout");
    } else {
      setZoomMode("normal");
    }
  }

  // Xử lý phím tắt
  useKeyboardControls(
    viewerRef,
    numPages,
    pageNumber,
    handlePageChange,
    scrollToPage,
    viewMode,
    setScale,
    setRotation,
    toggleFullscreen,
    isFullscreen,
    zoomMode,
    setZoomMode,
    toggleViewMode
  );

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoadError(null);
    setIsLoading(false);

    // Khởi tạo mảng refs cho các trang
    pagesRef.current = Array(numPages).fill(null);
  }

  function onDocumentLoadError(error: Error) {
    setLoadError(error.message);
    setIsLoading(false);
  }

  function handleDownload() {
    const a = document.createElement("a");
    a.href = url;
    a.download = url.split("/").pop() || "document.pdf";
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  const containerHeight = isFullscreen
    ? "calc(100vh - 128px)"
    : zoomMode === "popout"
      ? "80vh"
      : height;

  if (useGoogleViewer) {
    return <GooglePDFViewer url={url} />;
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
      {isLoading && (
        <div className="bg-background/50 absolute inset-0 z-10 flex items-center justify-center backdrop-blur-sm">
          <div className="text-center">
            <div className="border-primary mb-2 h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
            <p className="font-medium">Đang kiểm tra và tải tài liệu...</p>
          </div>
        </div>
      )}

      <div
        ref={documentRef}
        className="bg-card mb-4 w-full overflow-auto rounded-lg border p-4"
        style={{
          height: containerHeight,
          cursor: "grab",
        }}
      >
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
          options={documentOptions}
        >
          {viewMode === "single" ? (
            <PDFSinglePage
              pageNumber={pageNumber}
              scale={scale}
              rotate={rotation}
            />
          ) : (
            <PDFMultiPage
              numPages={numPages}
              scale={scale}
              rotate={rotation}
              setPageRef={setPageRef}
            />
          )}
        </Document>
      </div>

      {numPages > 0 && (
        <PDFToolbar
          scale={scale}
          setScale={setScale}
          rotation={rotation}
          setRotation={setRotation}
          pageNumber={pageNumber}
          numPages={numPages}
          pageInputValue={pageInputValue}
          viewMode={viewMode}
          handlePageChange={handlePageChange}
          handlePageInputChange={handlePageInputChange}
          handlePageInputBlur={handlePageInputBlur}
          toggleViewMode={toggleViewMode}
          toggleZoomMode={toggleZoomMode}
          toggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
        />
      )}

      {isFullscreen && (
        <div className="absolute bottom-4 right-4">
          <Button variant="outline" onClick={toggleFullscreen}>
            Thoát toàn màn hình (ESC)
          </Button>
        </div>
      )}

      {zoomMode === "popout" && (
        <PDFPopupViewer
          pdfUrl={pdfUrl}
          documentOptions={documentOptions}
          numPages={numPages}
          pageNumber={pageNumber}
          scale={scale}
          handlePageChange={handlePageChange}
          setZoomMode={setZoomMode}
        />
      )}
    </div>
  );
}
