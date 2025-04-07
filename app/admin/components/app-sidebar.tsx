"use client";

import { Settings } from "lucide-react";
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
import { navAdmin } from "@/config/nav";

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
        <NavMain items={navAdmin.navMain} />
        <NavSecondary items={navAdmin.navSecondary} />
        <NavUtil className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <UserButton size="full" />
      </SidebarFooter>
    </Sidebar>
  );
}
