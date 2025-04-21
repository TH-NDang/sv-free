import { Skeleton } from "@/components/ui/skeleton";

export default function MyLibraryLoading() {
  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6">
      {/* Profile Header Placeholder */}
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
        <Skeleton className="h-20 w-20 rounded-full sm:h-24 sm:w-24" />
        <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
          <Skeleton className="mb-2 h-7 w-48 sm:h-8" /> {/* Name */}
          <Skeleton className="mb-3 h-5 w-64 sm:mb-4" /> {/* Email */}
          <Skeleton className="h-9 w-28" /> {/* Edit Button */}
        </div>
      </div>

      {/* Profile Stats Placeholder */}
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <Skeleton className="h-[98px] w-full rounded-lg" /> {/* Uploads Card */}
        <Skeleton className="h-[98px] w-full rounded-lg" />{" "}
        {/* Downloads Card */}
        <Skeleton className="h-[98px] w-full rounded-lg" /> {/* Saved Card */}
      </div>

      {/* Tabs Placeholder */}
      <div className="w-full">
        {/* Tabs List */}
        <div className="bg-muted/60 grid h-12 w-full grid-cols-2 rounded-lg p-1">
          <Skeleton className="h-full w-full rounded-md" />
          <Skeleton className="h-full w-full rounded-md" />
        </div>

        {/* Tab Content Placeholder (Assuming "My Uploads" is default) */}
        <div className="mt-6 space-y-4">
          {/* Title and Upload Button */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-7 w-64" />{" "}
            {/* "My Uploaded Documents (x)" */}
            <Skeleton className="h-9 w-28" /> {/* "Upload New" Button */}
          </div>

          {/* Documents Grid Placeholder */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
            {/* Add more skeletons if needed */}
          </div>
        </div>
      </div>
    </div>
  );
}
