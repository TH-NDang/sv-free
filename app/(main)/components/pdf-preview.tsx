"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Custom hook for PDF preview
 */

export const usePdfPreview = (file: File | null) => {
  const [preview, setPreview] = useState<string | null>(null);
  const pdfObjectUrl = useRef<string | null>(null);

  useEffect(() => {
    if (file) {
      if (pdfObjectUrl.current) {
        URL.revokeObjectURL(pdfObjectUrl.current);
      }
      pdfObjectUrl.current = URL.createObjectURL(file);
      setPreview(pdfObjectUrl.current);
    }

    return () => {
      if (pdfObjectUrl.current) {
        URL.revokeObjectURL(pdfObjectUrl.current);
        pdfObjectUrl.current = null;
      }
    };
  }, [file]);

  return preview;
};

export function PdfPreview({ file }: { file: File }) {
  const preview = usePdfPreview(file);

  if (!preview) return null;

  return (
    <div className="mt-4">
      <div className="relative overflow-hidden rounded-md border p-1">
        <div className="mb-2 flex items-center px-1">
          <div className="text-sm font-medium">{file.name}</div>
        </div>
        <div className="relative h-72 w-full overflow-hidden rounded">
          <iframe
            src={preview}
            title="PDF Preview"
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </div>
  );
}
