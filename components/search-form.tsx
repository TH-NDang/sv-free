"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { Input } from "@/components/ui/input";
import { useDocumentStore } from "@/lib/states/document-store";
import { SearchIcon } from "lucide-react";

export function SearchForm({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(query, 500);
  const router = useRouter();
  const setSearchQuery = useDocumentStore((state) => state.setSearchQuery);

  // Xử lý thay đổi query debounced
  useEffect(() => {
    if (debouncedQuery.trim()) {
      setSearchQuery(debouncedQuery);
      router.push(`/documents?q=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery, setSearchQuery, router]);

  return (
    <div className="w-full max-w-xl">
      <div className="relative flex-1">
        <SearchIcon className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
        <Input
          type="search"
          name="q"
          placeholder="Search for documents, subjects, topics..."
          className="pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
    </div>
  );
}
