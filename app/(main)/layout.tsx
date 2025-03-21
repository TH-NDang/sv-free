import { Metadata } from "next";
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
    <main className="[--header-height:calc(theme(spacing.14))]">
      <SidebarProvider defaultOpen={defaultOpen} className="flex flex-col">
        <SiteHeader />
        <div className="flex flex-1">
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </div>
      </SidebarProvider>
    </main>
  );
}
