import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 sm:gap-6 sm:p-6">
      {/* Placeholder for Hero Section */}
      <div className="bg-card flex flex-col items-center justify-center rounded-lg border p-4 text-center sm:p-8">
        <Skeleton className="mb-2 h-8 w-3/4 sm:h-10" /> {/* Title */}
        <Skeleton className="mb-4 h-4 w-full max-w-2xl sm:mb-6" />{" "}
        {/* Description */}
        <Skeleton className="h-10 w-full max-w-lg" /> {/* Search Bar */}
      </div>

      {/* Placeholder for Category Tabs */}
      <div className="-mx-4 flex justify-start space-x-2 overflow-auto px-4 pb-1 sm:mx-0 sm:justify-center sm:px-0">
        <Skeleton className="h-10 w-20 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
        <Skeleton className="h-10 w-16 rounded-full" />
        <Skeleton className="h-10 w-28 rounded-full" />
        <Skeleton className="h-10 w-20 rounded-full" />
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>

      {/* Placeholder for Recent/Popular Lists */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {/* Recently Added List Placeholder */}
        <div className="bg-card rounded-lg border p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-6 w-32" /> {/* List Title */}
            <Skeleton className="h-5 w-16" /> {/* View All */}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
        {/* Most Popular List Placeholder */}
        <div className="bg-card rounded-lg border p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <Skeleton className="h-6 w-32" /> {/* List Title */}
            <Skeleton className="h-5 w-16" /> {/* View All */}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>

      {/* Placeholder for Browse by Category Grid */}
      <div className="bg-card rounded-lg border p-4 sm:p-6">
        <Skeleton className="mb-4 h-6 w-48" /> {/* Grid Title */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
          <Skeleton className="h-24 w-full rounded-md" />
        </div>
      </div>

      {/* Placeholder for Upload CTA (Optional, can be omitted if simple) */}
      {/* <Skeleton className="h-20 w-full rounded-lg" /> */}
    </div>
  );
}
