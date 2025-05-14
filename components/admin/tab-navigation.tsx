"use client";

import { File, Folder, Tag } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function AdminTabNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = searchParams.get("tab") || "documents";

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", value);
    // Reset page to 1 for both documents and categories
    params.set("page", "1");
    params.set("categoryPage", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger
          value="documents"
          className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 transition-colors"
        >
          <File className="h-4 w-4" />
          <span>Documents</span>
        </TabsTrigger>
        <TabsTrigger
          value="categories"
          className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 transition-colors"
        >
          <Folder className="h-4 w-4" />
          <span>Categories</span>
        </TabsTrigger>
        <TabsTrigger
          value="tags"
          className="hover:bg-accent hover:text-accent-foreground flex cursor-pointer items-center gap-2 transition-colors"
        >
          <Tag className="h-4 w-4" />
          <span>Tags</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export function AdminActionButton({ tab }: { tab: string }) {
  const router = useRouter();

  const getButtonProps = () => {
    switch (tab) {
      case "documents":
        return {
          icon: <File className="mr-2 h-4 w-4" />,
          label: "Add Document",
          href: "/admin/documents/create",
        };
      case "categories":
        return {
          icon: <Folder className="mr-2 h-4 w-4" />,
          label: "Add Category",
          href: "/admin/categories/create",
        };
      case "tags":
        return {
          icon: <Tag className="mr-2 h-4 w-4" />,
          label: "Add Tag",
          href: "/admin/tags/create",
        };
      default:
        return {
          icon: <File className="mr-2 h-4 w-4" />,
          label: "Add Document",
          href: "/admin/documents/create",
        };
    }
  };

  const { icon, label, href } = getButtonProps();

  return (
    <Button onClick={() => router.push(href)}>
      {icon}
      {label}
    </Button>
  );
}
