"use client";

import { DocumentsGrid } from "@/app/(main)/components/documents-grid";
import { Document } from "@/app/(main)/types/document";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { BookmarkIcon, FileUpIcon, PlusIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface DbDocument {
  id: string;
  title: string;
  description?: string | null;
  fileUrl: string;
  fileType?: string | null;
  fileSize?: string | null;
  categoryId?: string | null;
  authorId?: string | null;
  thumbnailUrl?: string | null;
  published?: boolean;
  downloadCount?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
  } | null;
}

const fetchUserDocuments = async () => {
  const response = await fetch("/api/documents?myUploads=true");
  if (!response.ok) {
    throw new Error(`Error: ${response.status}`);
  }
  return response.json() as Promise<DbDocument[]>;
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("uploads");
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const {
    data: dbDocuments = [],
    isLoading: isLoadingDocuments,
    error,
  } = useQuery({
    queryKey: ["userDocuments", user?.id],
    queryFn: fetchUserDocuments,
    staleTime: 30 * 1000,
    refetchOnMount: "always",
    enabled: !!user,
  });

  // Convert DB documents to UI document format
  const uploads: Document[] = dbDocuments.map((doc) => ({
    id: doc.id,
    title: doc.title,
    description: doc.description || "",
    category: doc.category?.name || "Uncategorized",
    author: user?.name || "Unknown",
    uploadDate: new Date(doc.createdAt).toISOString(),
    downloadCount: parseInt(doc.downloadCount || "0"),
    fileSize: doc.fileSize || "Unknown",
    fileType: doc.fileType || "Unknown",
    thumbnailUrl: doc.thumbnailUrl || "/placeholder-thumbnail.jpg",
    status: doc.published ? "Published" : "Draft",
  }));

  // Use a subset for saved documents
  const savedDocuments = uploads.slice(0, 4);

  const userStats = {
    uploads: uploads.length,
    downloads: uploads.reduce((sum, doc) => sum + doc.downloadCount, 0),
    savedDocuments: savedDocuments.length,
  };

  if (isLoadingDocuments) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
            <AvatarFallback className="text-lg">
              {user?.name?.charAt(0).toUpperCase() || (
                <UserIcon className="h-8 w-8" />
              )}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
            <h1 className="text-3xl font-bold">
              {user?.name || "User Profile"}
            </h1>
            <p className="text-muted-foreground mb-4">{user?.email || ""}</p>

            <div className="flex flex-wrap gap-3">
              <Link href="/settings">
                <Button variant="outline" size="sm">
                  Edit Profile
                </Button>
              </Link>
              <Link href="/documents/upload">
                <Button size="sm">
                  <PlusIcon className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{userStats.uploads}</CardTitle>
              <CardDescription>Uploads</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{userStats.downloads}</CardTitle>
              <CardDescription>Total Downloads</CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">
                {userStats.savedDocuments}
              </CardTitle>
              <CardDescription>Saved Documents</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="uploads"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="bg-muted/60 grid w-full grid-cols-2 rounded-lg">
            <TabsTrigger value="uploads" className="rounded-md py-2">
              My Uploads
            </TabsTrigger>
            <TabsTrigger value="saved" className="rounded-md py-2">
              Saved Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="uploads" className="mt-6">
            {isLoadingDocuments ? (
              <div className="flex h-[200px] items-center justify-center">
                <p>Loading your documents...</p>
              </div>
            ) : error ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-red-500">
                <p>Error loading documents</p>
                <p className="text-sm">{(error as Error).message}</p>
              </div>
            ) : uploads.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">
                    My Uploaded Documents
                  </h2>
                  <Link href="/documents/upload">
                    <Button size="sm">
                      <FileUpIcon className="mr-2 h-4 w-4" />
                      Upload New
                    </Button>
                  </Link>
                </div>
                <DocumentsGrid documents={uploads} />
              </div>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed">
                <FileUpIcon className="text-muted-foreground mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-medium">No uploads yet</h3>
                <p className="text-muted-foreground mb-4 max-w-md text-center">
                  Share your knowledge with other students by uploading
                  documents
                </p>
                <Link href="/documents/upload">
                  <Button>
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="saved" className="mt-6">
            {isLoadingDocuments ? (
              <div className="flex h-[200px] items-center justify-center">
                <p>Loading your saved documents...</p>
              </div>
            ) : error ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-red-500">
                <p>Error loading documents</p>
                <p className="text-sm">{(error as Error).message}</p>
              </div>
            ) : savedDocuments.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Saved Documents</h2>
                  <Link href="/documents">
                    <Button variant="outline" size="sm">
                      Browse More
                    </Button>
                  </Link>
                </div>
                <DocumentsGrid documents={savedDocuments} />
              </div>
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed">
                <BookmarkIcon className="text-muted-foreground mb-4 h-12 w-12" />
                <h3 className="mb-2 text-lg font-medium">No saved documents</h3>
                <p className="text-muted-foreground mb-4 max-w-md text-center">
                  Save documents you find useful to access them quickly later
                </p>
                <Link href="/documents">
                  <Button>Browse Documents</Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
