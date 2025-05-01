import type { Metadata } from "next";
import { cookies } from "next/headers";

import { AppSidebar } from "@/app/(main)/components/app-sidebar";
import { SiteHeader } from "@/app/(main)/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export const metadata: Metadata = {
  title: "Document Library",
  description: "A curated collection of educational resources and documents.",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <main className="relative min-h-[100dvh] max-w-[100vw] overflow-hidden [--header-height:calc(theme(spacing.14))]">
      <SidebarProvider
        defaultOpen={defaultOpen}
        className="flex h-[100dvh] flex-col"
      >
        <SiteHeader />
        <div className="flex flex-1 overflow-hidden">
          <AppSidebar />
          <SidebarInset className="w-full overflow-y-auto">
            <div className="mx-auto w-full px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </main>
  );
}
