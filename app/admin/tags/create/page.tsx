import { Metadata } from "next";
import Link from "next/link";

// import { CreateTagForm } from "@/components/admin/tags/create-tag-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Create Tag",
  description: "Create a new tag",
};

export default function CreateTagPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link href="/admin/tags">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tags
          </Link>
        </Button>
      </div>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight">Create Tag</h1>
        <p className="text-muted-foreground mt-2">
          Add a new tag to organize documents
        </p>
        <div className="mt-8">
          {/* <CreateTagForm /> */}
          <p>Tạm thời chưa hỗ trợ</p>
        </div>
      </div>
    </div>
  );
}
