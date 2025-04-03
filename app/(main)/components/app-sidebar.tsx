"use client";

import { HomeIcon, Library, SearchIcon } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/app/(main)/components/nav-main";
import { NavSecondary } from "@/app/(main)/components/nav-secondary";
import { Sidebar, SidebarContent, SidebarRail } from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Home",
      url: "/",
      icon: HomeIcon,
    },
    {
      title: "Advanced Search",
      url: "/search",
      icon: SearchIcon,
    },
  ],
  navProfile: [
    {
      title: "My Library",
      url: "/my-library",
      icon: Library,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavMain label="Discovery" items={data.navMain} />
        <NavMain label="Personal" items={data.navProfile} />

        <NavSecondary className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
