"use client";

import { SidebarIcon } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";

export function MainNav() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleSidebar}
        className="cursor-pointer gap-2.5 has-[>svg]:px-2"
      >
        <SidebarIcon />
        <span className="truncate font-medium">Document Library</span>
      </Button>

      <div className="ml-auto">
        <SearchForm />
      </div>
    </div>
  );
}
