"use client";

import { PlusIcon, ShareIcon, SidebarIcon, UploadIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useMemo } from "react";

import { ModeToggle } from "@/app/(main)/components/mode-toggle";
import { NavUser } from "@/app/(main)/components/nav-user";
import { SearchForm } from "@/components/demo/search-form";
import { ThemeSelector } from "@/components/theme-selector";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const pathname = usePathname();

  // Faux breadcrumbs for demo.
  const breadcrumbs = useMemo(() => {
    return pathname
      .split("/")
      .filter((path) => path !== "")
      .map((path, index, array) => ({
        label: path,
        href: `/${array.slice(0, index + 1).join("/")}`,
      }));
  }, [pathname]);

  return (
    <header
      data-slot="site-header"
      className="bg-background sticky top-0 z-50 flex w-full items-center border-b"
    >
      <div className="h-(--header-height) flex w-full items-center gap-2 px-2 pr-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="cursor-pointer gap-2.5 has-[>svg]:px-2"
        >
          <SidebarIcon />
          <span className="truncate font-medium">Document Library</span>
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="capitalize">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            {breadcrumbs.map((breadcrumb, index) =>
              index === breadcrumbs.length - 1 ? (
                <BreadcrumbItem key={index}>
                  <BreadcrumbPage className="capitalize">
                    {breadcrumb.label}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              ) : (
                <Fragment key={index}>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      href={breadcrumb.href}
                      className="capitalize"
                    >
                      {breadcrumb.label}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </Fragment>
              )
            )}
          </BreadcrumbList>
        </Breadcrumb>
        <div className="ml-auto flex items-center gap-2">
          <SearchForm className="w-full sm:w-auto" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                <PlusIcon className="mr-1 h-4 w-4" />
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
              <DropdownMenuItem>
                <ShareIcon className="mr-2 h-4 w-4" />
                <span>Request Document</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Create Folder</DropdownMenuItem>
              <DropdownMenuItem>Create Collection</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" className="ml-1">
                <ShareIcon className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share Document</TooltipContent>
          </Tooltip>

          <ThemeSelector />
          <ModeToggle />
          <NavUser />
        </div>
      </div>
    </header>
  );
}
