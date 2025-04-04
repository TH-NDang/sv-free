"use client";

import { SidebarIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { Fragment, useMemo } from "react";

import { SearchForm } from "@/components/search-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";

export function MainNav() {
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

      <Separator
        orientation="vertical"
        className="mr-2 data-[orientation=vertical]:h-4"
      />

      <Breadcrumb className="hidden lg:block">
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
                  <BreadcrumbLink href={breadcrumb.href} className="capitalize">
                    {breadcrumb.label}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            )
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto">
        <SearchForm />
      </div>
    </div>
  );
}
