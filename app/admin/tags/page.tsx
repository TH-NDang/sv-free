"use client";

import Link from "next/link";

import { TagsTable } from "@/components/admin/tags/tags-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TagsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tags</h1>
          <p className="text-muted-foreground">
            Manage document tags and categories
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/tags/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Tag
          </Link>
        </Button>
      </div>
      <div className="mt-8">
        <TagsTable />
      </div>
    </div>
  );
}
