"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { SidebarIcon } from "lucide-react";

export function MainNav() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="hidden items-center md:flex">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="cursor-pointer gap-2.5 has-[>svg]:px-2"
      >
        <SidebarIcon />
        <span className="truncate font-medium">Document Library</span>
      </Button>
    </div>
  );
}
