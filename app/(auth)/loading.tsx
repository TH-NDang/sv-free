import { Skeleton } from "@/components/ui/skeleton";

export default function AuthLoading() {
  return (
    <div className="container flex h-screen items-center justify-center py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Skeleton className="mx-auto h-10 w-[200px]" />
          <Skeleton className="mx-auto mt-2 h-4 w-[300px]" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        <div className="flex justify-center">
          <Skeleton className="h-4 w-[250px]" />
        </div>
      </div>
    </div>
  );
}
