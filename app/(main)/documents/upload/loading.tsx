import { Skeleton } from "@/components/ui/skeleton";

export default function DocumentUploadLoading() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-12 pt-6 md:px-6">
      {/* Header Placeholder */}
      <div className="mb-6">
        <Skeleton className="h-8 w-64" /> {/* "Upload Document" Title */}
        <Skeleton className="mt-2 h-5 w-80" /> {/* Subtitle */}
      </div>

      {/* FileUpload Component Area Placeholder */}
      <div className="bg-card rounded-lg border p-6">
        <Skeleton className="mb-2 h-6 w-32" /> {/* Step Title */}
        <Skeleton className="mb-6 h-4 w-64" /> {/* Step Description */}
        <div className="border-border flex h-[250px] w-full flex-col items-center justify-center rounded-md border-2 border-dashed">
          {/* Placeholder for the upload icon and text */}
          <Skeleton className="mb-4 h-12 w-12 rounded-full" />
          <Skeleton className="mb-2 h-5 w-24" />
          <Skeleton className="h-4 w-48" />
        </div>
        {/* Action Buttons Placeholder */}
        <div className="mt-6 flex justify-end gap-2">
          <Skeleton className="h-9 w-20" /> {/* Cancel Button */}
          <Skeleton className="h-9 w-32" /> {/* Upload Button */}
        </div>
      </div>
    </main>
  );
}
