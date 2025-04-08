import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container animate-pulse py-8">
      <Skeleton className="mb-6 h-10 w-[250px]" />

      <div className="mb-6">
        <Skeleton className="h-10 w-full" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}
