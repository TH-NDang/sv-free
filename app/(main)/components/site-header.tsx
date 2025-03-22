"use client";

import { PlusIcon, ShareIcon, UploadIcon } from "lucide-react";
import Link from "next/link";

import { MainNav } from "@/app/(main)/components/main-nav";
import { MobileNav } from "@/app/(main)/components/mobile-nav";
import { ModeToggle } from "@/app/(main)/components/mode-toggle";
import { NavUser } from "@/app/(main)/components/nav-user";
import { ThemeSelector } from "@/components/theme-selector";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SiteHeader() {
  return (
    <header
      data-slot="site-header"
      className="bg-background sticky top-0 z-50 flex w-full items-center border-b"
    >
      <div className="flex h-[var(--header-height)] w-full items-center justify-between px-2 sm:px-3 md:px-4">
        {/* Left side: Navigation */}
        <MobileNav />
        <MainNav />

        {/* Right side: Actions */}
        <div className="flex items-center gap-4 px-2 sm:gap-8 md:gap-6">
          {/* Add Document dropdown - hiển thị trên mọi thiết bị nhưng đơn giản hóa trên mobile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-1 sm:ml-2">
                <PlusIcon className="h-4 w-4 sm:mr-1" />
                <span className="hidden sm:inline">Add Document</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <Link href="/documents/upload">
                <DropdownMenuItem>
                  <UploadIcon className="mr-2 h-4 w-4" />
                  <span>Upload File</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="hidden sm:flex">
                <ShareIcon className="mr-2 h-4 w-4" />
                <span>Request Document</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex items-center gap-4">
            {/* Theme selector - chỉ hiển thị trên màn hình lớn */}
            <div className="hidden lg:block">
              <ThemeSelector />
            </div>

            {/* Mode toggle và User profile - hiển thị trên mọi thiết bị */}
            <div className="flex items-center gap-4 sm:gap-8 md:gap-6">
              <ModeToggle />
              <NavUser />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
