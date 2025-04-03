"use client";

import { IconFile, IconFolder, IconTag } from "@tabler/icons-react";
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
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="documents" className="flex items-center gap-2">
          <IconFile className="h-4 w-4" />
          <span>Documents</span>
        </TabsTrigger>
        <TabsTrigger value="categories" className="flex items-center gap-2">
          <IconFolder className="h-4 w-4" />
          <span>Categories</span>
        </TabsTrigger>
        <TabsTrigger value="tags" className="flex items-center gap-2">
          <IconTag className="h-4 w-4" />
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
          icon: <IconFile className="mr-2 h-4 w-4" />,
          label: "Add Document",
          href: "/admin/documents/create",
        };
      case "categories":
        return {
          icon: <IconFolder className="mr-2 h-4 w-4" />,
          label: "Add Category",
          href: "/admin/categories/create",
        };
      case "tags":
        return {
          icon: <IconTag className="mr-2 h-4 w-4" />,
          label: "Add Tag",
          href: "/admin/tags/create",
        };
      default:
        return {
          icon: <IconFile className="mr-2 h-4 w-4" />,
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
