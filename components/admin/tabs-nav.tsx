"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

interface TabsNavProps {
  activeTab?: string;
}

export function TabsNav({ activeTab = "documents" }: TabsNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Create URL with new tab parameter
  const createTabUrl = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    return `${pathname}?${params.toString()}`;
  };

  const tabs = [
    { id: "documents", label: "Documents" },
    { id: "categories", label: "Categories" },
    { id: "tags", label: "Tags" },
  ];

  return (
    <div className="border-b">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={createTabUrl(tab.id)}
            className={cn(
              "border-b-2 border-transparent py-4 text-sm font-medium",
              {
                "border-primary text-primary": activeTab === tab.id,
                "text-muted-foreground hover:text-foreground hover:border-muted-foreground":
                  activeTab !== tab.id,
              }
            )}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
