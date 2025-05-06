"use client";

import { FileInputIcon, FileText, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { nav } from "@/config/nav";
import { useDocumentStore } from "@/lib/states/document-store";
import { toast } from "sonner";

export function SearchForm({ initialQuery = "" }: { initialQuery?: string }) {
  const [query] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(query, 500);
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const setSearchQuery = useDocumentStore((state) => state.setSearchQuery);

  useEffect(() => {
    if (debouncedQuery.trim() && !open) {
      setSearchQuery(debouncedQuery);
      router.push(`/documents?q=${encodeURIComponent(debouncedQuery)}`);
    }
  }, [debouncedQuery, setSearchQuery, router, open]);

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

  const handleCommandSearch = (value: string) => {
    if (value.trim()) {
      setSearchQuery(value);
      setOpen(false);
      router.push(`/documents?q=${encodeURIComponent(value)}`);
      toast.success("Searching for: " + value);
    }
  };

  const handleNavigation = (url: string) => {
    setOpen(false);
    router.push(url);
  };

  return (
    <>
      <div className="w-full max-w-xl">
        <div className="relative flex-1">
          <button
            className="border-input bg-background text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:ring-ring/50 shadow-xs inline-flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none transition-[color,box-shadow] focus-visible:ring-[3px]"
            onClick={() => setOpen(true)}
          >
            <span className="flex grow items-center">
              <SearchIcon
                className="text-muted-foreground/80 -ms-1 me-3"
                size={16}
                aria-hidden="true"
              />
              <span className="text-muted-foreground/70 font-normal">
                Search documents, navigate, or run commands...
              </span>
            </span>
            <kbd className="bg-background text-muted-foreground/70 ms-2 inline-flex h-5 max-h-full items-center rounded border px-1 font-[inherit] text-[0.625rem] font-medium">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search documents, navigate, or run commands..."
          onValueChange={handleCommandSearch}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => handleNavigation("/documents")}>
              <FileText
                size={16}
                className="mr-2 opacity-60"
                aria-hidden="true"
              />
              <span>Browse All Documents</span>
            </CommandItem>
            <CommandItem onSelect={() => handleNavigation("/search")}>
              <SearchIcon
                size={16}
                className="mr-2 opacity-60"
                aria-hidden="true"
              />
              <span>Advanced Search</span>
            </CommandItem>
            <CommandItem onSelect={() => toast.info("Document upload clicked")}>
              <FileInputIcon
                size={16}
                className="mr-2 opacity-60"
                aria-hidden="true"
              />
              <span>Upload Document</span>
              <CommandShortcut className="justify-center">⌘U</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Navigation">
            {nav.navMain.map((item) => (
              <CommandItem
                key={item.url}
                onSelect={() => handleNavigation(item.url)}
              >
                <item.icon
                  size={16}
                  className="mr-2 opacity-60"
                  aria-hidden="true"
                />
                <span>Go to {item.title}</span>
              </CommandItem>
            ))}

            {nav.navProfile.map((item) => (
              <CommandItem
                key={item.url}
                onSelect={() => handleNavigation(item.url)}
              >
                <item.icon
                  size={16}
                  className="mr-2 opacity-60"
                  aria-hidden="true"
                />
                <span>Go to {item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
