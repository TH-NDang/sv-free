"use client";

import {
  FolderIcon,
  MenuIcon,
  PlusIcon,
  SettingsIcon,
  Share2Icon,
  UploadIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { nav } from "@/config/nav";

// Actions từ header
const headerActions = [
  { title: "Add Document", url: "/documents/new", icon: PlusIcon },
  { title: "Upload File", url: "/documents/upload", icon: UploadIcon },
  { title: "Share Document", url: "#", icon: Share2Icon },
  { title: "Create Collection", url: "/collections/new", icon: FolderIcon },
];

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <div className="flex md:hidden">
      <div className="flex items-center">
        {/* Menu Drawer cho thiết bị di động */}
        <Drawer open={open} onOpenChange={setOpen} direction="left">
          <DrawerTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-1">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DrawerTrigger>
          <DrawerContent className="left-0 right-auto h-[100dvh] w-[85vw] max-w-[320px] p-0">
            <div className="flex h-full flex-col">
              <div className="flex h-14 items-center border-b px-4">
                <span className="font-medium">Document Library</span>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="p-4">
                  <SearchForm />
                </div>

                {/* Main Navigation */}
                <div className="text-muted-foreground px-2 py-1 text-sm font-medium">
                  Discovery
                </div>
                <div className="px-1 py-1">
                  {nav.navMain.map((item) => (
                    <MobileLink
                      key={item.url}
                      href={item.url}
                      onOpenChange={setOpen}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2",
                        pathname === item.url
                          ? "bg-muted/50 font-medium"
                          : "hover:bg-muted/30 font-normal"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.title}
                    </MobileLink>
                  ))}
                </div>

                {/* Personal */}
                <div className="mt-4">
                  <div className="text-muted-foreground px-2 py-1 text-sm font-medium">
                    Personal
                  </div>
                  <div className="px-1 py-1">
                    {nav.navProfile.map((item) => (
                      <MobileLink
                        key={item.url}
                        href={item.url}
                        onOpenChange={setOpen}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2",
                          pathname === item.url
                            ? "bg-muted/50 font-medium"
                            : "hover:bg-muted/30 font-normal"
                        )}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </MobileLink>
                    ))}
                  </div>
                </div>

                {/* Quick Actions from Header */}
                <div className="mt-4">
                  <div className="text-muted-foreground px-2 py-1 text-sm font-medium">
                    Quick Actions
                  </div>
                  <div className="px-1 py-1">
                    {headerActions.map((item) => (
                      <MobileLink
                        key={item.url}
                        href={item.url}
                        onOpenChange={setOpen}
                        className="hover:bg-muted/30 flex items-center gap-3 rounded-md px-3 py-2"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </MobileLink>
                    ))}
                  </div>
                </div>

                {/* Help & Support */}
                <div className="mb-6 mt-4">
                  <div className="text-muted-foreground px-2 py-1 text-sm font-medium">
                    Help & Support
                  </div>
                  <div className="px-1 py-1">
                    {nav.navProfile.map((item) => (
                      <MobileLink
                        key={item.url}
                        href={item.url}
                        onOpenChange={setOpen}
                        className="hover:bg-muted/30 flex items-center gap-3 rounded-md px-3 py-2"
                      >
                        <item.icon className="h-4 w-4" />
                        {item.title}
                      </MobileLink>
                    ))}
                    <MobileLink
                      href="/settings"
                      onOpenChange={setOpen}
                      className="hover:bg-muted/30 flex items-center gap-3 rounded-md px-3 py-2"
                    >
                      <SettingsIcon className="h-4 w-4" />
                      Settings
                    </MobileLink>
                  </div>
                </div>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}

interface MobileLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  href: string;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(href);
    onOpenChange?.(false);
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={cn("text-foreground/80 hover:text-foreground", className)}
      {...props}
    >
      {children}
    </Link>
  );
}
