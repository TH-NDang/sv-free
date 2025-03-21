"use client";

import {
  BookmarkIcon,
  ClockIcon,
  FileTextIcon,
  FolderIcon,
  LifeBuoy,
  UsersIcon,
} from "lucide-react";
import * as React from "react";

import { NavMain } from "@/app/(main)/components/nav-main";
import { NavSecondary } from "@/app/(main)/components/nav-secondary";
import { Sidebar, SidebarContent } from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "My Documents",
      url: "/",
      icon: FileTextIcon,
    },
    {
      title: "Recent",
      url: "/documents/recent",
      icon: ClockIcon,
    },
    {
      title: "Categories",
      url: "/documents/categories",
      icon: FolderIcon,
    },
    {
      title: "Saved",
      url: "/documents/saved",
      icon: BookmarkIcon,
    },
    {
      title: "Shared with Me",
      url: "/documents/shared",
      icon: UsersIcon,
    },
  ],
  navSecondary: [
    {
      title: "Help",
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
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
    </Sidebar>
  );
}
