import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-4">
        <Skeleton className="h-8 w-[250px]" />
        <Skeleton className="h-4 w-[400px]" />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-lg" />
        ))}
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="rounded-lg border">
          <Skeleton className="h-[300px] w-full rounded-lg" />
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <div className="rounded-lg border">
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
