// app/(main)/settings/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      {/* Header Placeholder */}
      <div className="mb-6 flex flex-col space-y-1">
        <Skeleton className="h-7 w-48" /> {/* Title */}
        <Skeleton className="h-5 w-64" /> {/* Subtitle */}
      </div>

      {/* Tabs Placeholder */}
      <div className="w-full">
        {/* Tabs List Placeholder */}
        <div className="bg-muted/60 mb-8 grid h-12 w-full grid-cols-3 rounded-lg p-1">
          <Skeleton className="h-full w-full rounded-md" /> {/* Profile Tab */}
          <Skeleton className="h-full w-full rounded-md" /> {/* Security Tab */}
          <Skeleton className="h-full w-full rounded-md" />{" "}
          {/* Notifications Tab */}
        </div>

        {/* Tab Content Placeholder (Mimicking Profile tab structure) */}
        <div className="min-h-[500px]">
          <div className="mx-auto max-w-xl">
            <div className="space-y-8">
              {/* Placeholder for SettingsCard (e.g., Avatar) */}
              <div className="bg-muted/30 rounded-lg p-6">
                <div className="mb-4">
                  <Skeleton className="h-5 w-20" /> {/* Card Title */}
                  <Skeleton className="mt-1 h-3 w-64" />{" "}
                  {/* Card Description */}
                </div>
                <Skeleton className="h-20 w-full rounded-md" />{" "}
                {/* Card Content Placeholder */}
              </div>

              {/* Placeholder for SettingsCard (e.g., Username) */}
              <div className="bg-muted/30 rounded-lg p-6">
                <div className="mb-4">
                  <Skeleton className="h-5 w-24" /> {/* Card Title */}
                  <Skeleton className="mt-1 h-3 w-56" />{" "}
                  {/* Card Description */}
                </div>
                <Skeleton className="h-24 w-full rounded-md" />{" "}
                {/* Card Content Placeholder */}
              </div>

              {/* Placeholder for SettingsCard (e.g., Email) */}
              <div className="bg-muted/30 rounded-lg p-6">
                <div className="mb-4">
                  <Skeleton className="h-5 w-16" /> {/* Card Title */}
                  <Skeleton className="mt-1 h-3 w-60" />{" "}
                  {/* Card Description */}
                </div>
                <Skeleton className="h-24 w-full rounded-md" />{" "}
                {/* Card Content Placeholder */}
              </div>

              {/* Placeholder for Destructive SettingsCard (e.g., Delete Account) */}
              <div className="border-destructive bg-destructive/5 rounded-lg border p-6">
                <div className="mb-4">
                  <Skeleton className="h-5 w-32" /> {/* Card Title */}
                  <Skeleton className="mt-1 h-3 w-48" />{" "}
                  {/* Card Description */}
                </div>
                <Skeleton className="h-10 w-full rounded-md" />{" "}
                {/* Card Content Placeholder */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
