"use client";

import {
  BarChart3,
  Database,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/app/admin/components/nav-main";
import { NavSecondary } from "@/app/admin/components/nav-secondary";
import { NavUtil } from "@/app/admin/components/nav-util";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserButton } from "@daveyplate/better-auth-ui";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: Users,
    },
    {
      title: "Documents",
      url: "/admin/documents",
      icon: FileText,
    },
    {
      title: "Analytics",
      url: "/admin/analytics",
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      name: "Export Data",
      url: "/admin/exports",
      icon: Database,
    },
    {
      name: "Reports",
      url: "/admin/reports",
      icon: FileText,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/admin">
                <Settings className="!size-5" />
                <span className="text-base font-semibold">Admin Panel</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} />
        <NavUtil className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <UserButton size="full" />
      </SidebarFooter>
    </Sidebar>
  );
}
