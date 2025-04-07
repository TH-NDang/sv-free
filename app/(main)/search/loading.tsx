import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <div className="container py-8">
      <Skeleton className="mb-6 h-10 w-[200px]" />

      <div className="mb-6">
        <Skeleton className="mb-8 h-12 w-full max-w-xl" />
      </div>

      <Skeleton className="mb-4 h-6 w-40" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-[180px] w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
