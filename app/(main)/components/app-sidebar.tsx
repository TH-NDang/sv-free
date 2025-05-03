"use client";

import * as React from "react";

import { NavMain } from "@/app/(main)/components/nav-main";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";
import { nav } from "@/config/nav";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="icon"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavMain label="Discovery" items={nav.navMain} />
        <NavMain label="Personal" items={nav.navProfile} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
