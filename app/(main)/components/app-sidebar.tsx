"use client";

import {
  BookmarkIcon,
  FileTextIcon,
  HomeIcon,
  LifeBuoy,
  SearchIcon,
  UploadIcon,
} from "lucide-react";
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
      title: "Browse Documents",
      url: "/documents",
      icon: FileTextIcon,
    },
    {
      title: "Advanced Search",
      url: "/search",
      icon: SearchIcon,
    },
    {
      title: "Upload Document",
      url: "/documents/upload",
      icon: UploadIcon,
    },
  ],
  navProfile: [
    {
      title: "My Uploads",
      url: "/profile?tab=uploads",
      icon: FileTextIcon,
    },
    {
      title: "Saved Documents",
      url: "/profile?tab=saved",
      icon: BookmarkIcon,
    },
  ],
  navSecondary: [
    {
      title: "Help & Support",
      url: "#",
      icon: LifeBuoy,
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

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
