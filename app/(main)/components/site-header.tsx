"use client";

import { UploadIcon } from "lucide-react";
import Link from "next/link";

import { MainNav } from "@/app/(main)/components/main-nav";
import { MobileNav } from "@/app/(main)/components/mobile-nav";
import { ModeToggle } from "@/app/(main)/components/mode-toggle";
import { NavUser } from "@/app/(main)/components/nav-user";
import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header
      data-slot="site-header"
      className="bg-background sticky top-0 z-50 flex w-full items-center border-b"
    >
      <div className="flex h-[var(--header-height)] w-full items-center justify-between px-2 sm:px-3 md:px-4">
        <div className="flex items-center gap-2">
          <MobileNav />
          <MainNav />
        </div>

        <div className="mx-auto hidden w-full max-w-md md:block">
          <SearchForm />
        </div>

        <div className="flex items-center gap-4 px-2 sm:gap-8 md:gap-6">
          <Link href="/documents/upload">
            <Button
              variant="outline"
              size="sm"
              className="ml-1 cursor-pointer p-4 sm:ml-2"
            >
              <UploadIcon className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Add Document</span>
            </Button>
          </Link>

          <div className="flex items-center gap-4">
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
