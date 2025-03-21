"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocumentStore } from "@/lib/states/document-store";

export function CategoryTabs({ categories }: { categories: string[] }) {
  const { activeCategory, setActiveCategory } = useDocumentStore();

  return (
    <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
      <TabsList className="bg-card h-10">
        <TabsTrigger value="all">All</TabsTrigger>
        {categories.map((category) => (
          <TabsTrigger key={category} value={category.toLowerCase()}>
            {category}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
