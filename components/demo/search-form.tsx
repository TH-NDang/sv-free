"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { SidebarInput } from "@/components/ui/sidebar";

export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleSearch = (searchTerm: string) => {
    setOpen(false);

    // If we're not already on the document page, navigate to it
    if (!window.location.pathname.includes("documents")) {
      router.push(`/?q=${encodeURIComponent(searchTerm)}`);
    } else {
      // Use URL params for search state
      const params = new URLSearchParams(searchParams.toString());
      params.set("q", searchTerm);
      router.push(`?${params.toString()}`);
    }
  };

  return (
    <>
      <form
        {...props}
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch(query);
        }}
      >
        <div className="relative">
          <Label htmlFor="search" className="sr-only">
            Search Documents
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search documents... (⌘K)"
            className="bg-background/60 border-input h-10 w-[240px] rounded-md border pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:ring-1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClick={() => setOpen(true)}
            readOnly
          />
          <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 select-none" />
          <kbd className="bg-muted text-muted-foreground pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 select-none items-center gap-1 rounded border px-1.5 font-mono text-xs opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </form>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search documents by title, author, category..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => handleSearch("programming")}>
              <Search className="mr-2 h-4 w-4" />
              <span>Programming documents</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSearch("mathematics")}>
              <Search className="mr-2 h-4 w-4" />
              <span>Mathematics documents</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSearch("physics")}>
              <Search className="mr-2 h-4 w-4" />
              <span>Physics documents</span>
            </CommandItem>
          </CommandGroup>
          <CommandGroup heading="Search options">
            <CommandItem onSelect={() => handleSearch(query)}>
              <Search className="mr-2 h-4 w-4" />
              <span>Search for &quot;{query || "..."}&quot;</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
