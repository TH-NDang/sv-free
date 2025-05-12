"use client";

import { DocumentsGrid } from "@/app/(main)/components/documents-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/lib/auth-client";
import { DocumentWithDetails } from "@/lib/db/queries";
import type { User } from "@/lib/db/schema";
import { useQuery } from "@tanstack/react-query";
import {
  BookmarkIcon,
  FileUpIcon,
  Loader2Icon,
  PlusIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type FetchedUserDocument = DocumentWithDetails & {
  fileUrl: string | null;
  thumbnailUrl: string | null;
};

const fetchUserDocuments = async (): Promise<FetchedUserDocument[]> => {
  const response = await fetch("/api/documents?myUploads=true");
  if (!response.ok) {
    let errorMsg = "Error fetching user documents";
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorData.error || errorMsg;
    } catch {
      /* Ignore */
    }
    throw new Error(errorMsg);
  }
  return response.json();
};

const fetchUserStats = async () => {
  const response = await fetch("/api/user/stats");
  if (!response.ok) {
    throw new Error("Failed to fetch user stats");
  }
  return response.json();
};

// --- Sub-Components --- //

interface ProfileHeaderProps {
  user: User | null;
  isLoading: boolean;
}

function ProfileHeader({ user, isLoading }: ProfileHeaderProps) {
  if (isLoading) {
    return (
      <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
        <Skeleton className="h-20 w-20 rounded-full sm:h-24 sm:w-24" />
        <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
          <Skeleton className="mb-2 h-7 w-48 sm:h-8" />
          <Skeleton className="mb-3 h-5 w-64 sm:mb-4" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 flex flex-col items-center gap-4 sm:flex-row sm:items-start sm:gap-6">
      <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
        <AvatarImage
          src={user?.image ?? undefined}
          alt={user?.name || "User"}
        />
        <AvatarFallback className="text-lg">
          {user?.name?.charAt(0).toUpperCase() || (
            <UserIcon className="h-8 w-8" />
          )}
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
        <h1 className="text-2xl font-bold sm:text-3xl">
          {user?.name || "User Profile"}
        </h1>
        <p className="text-muted-foreground mb-3 text-sm sm:mb-4 sm:text-base">
          {user?.email || ""}
        </p>

        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          <Link href="/settings">
            <Button variant="outline" size="sm" disabled={!user}>
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

interface ProfileStatsProps {
  stats: {
    uploads: number;
    downloads: number;
    savedDocuments: number;
  };
  isLoading: boolean;
}

function ProfileStats({ stats, isLoading }: ProfileStatsProps) {
  if (isLoading) {
    return (
      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
        <Skeleton className="h-[98px] w-full rounded-lg" />
        <Skeleton className="h-[98px] w-full rounded-lg" />
        <Skeleton className="h-[98px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-muted-foreground text-base font-medium">
            Uploads
          </CardTitle>
          <CardDescription className="text-2xl font-bold">
            {stats.uploads}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-muted-foreground text-base font-medium">
            Total Downloads
          </CardTitle>
          <CardDescription className="text-2xl font-bold">
            {stats.downloads}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-muted-foreground text-base font-medium">
            Saved
          </CardTitle>
          <CardDescription className="text-2xl font-bold">
            {stats.savedDocuments}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}

interface TabContentProps {
  documents: FetchedUserDocument[];
  isLoading: boolean;
  error: Error | null;
}

function UploadsTabContent({ documents, isLoading, error }: TabContentProps) {
  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2Icon className="text-primary/70 h-8 w-8 animate-spin" />
          <p className="text-muted-foreground text-sm">
            Loading your documents...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-destructive bg-destructive/10 text-destructive flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
        <p className="font-medium">Error loading documents</p>
        <p className="mt-1 text-sm">{(error as Error).message}</p>
      </div>
    );
  }

  if (documents.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            My Uploaded Documents ({documents.length})
          </h2>
          <Link href="/documents/upload">
            <Button variant="outline" size="sm">
              <FileUpIcon className="mr-1.5 h-4 w-4" />
              Upload New
            </Button>
          </Link>
        </div>
        <DocumentsGrid documents={documents} />
      </div>
    );
  }

  // Empty state
  return (
    <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
      <FileUpIcon className="text-muted-foreground mb-4 h-12 w-12" />
      <h3 className="mb-2 text-lg font-medium">No uploads yet</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">
        Share your knowledge with other students by uploading documents.
      </p>
      <Link href="/documents/upload">
        <Button>
          <PlusIcon className="mr-1.5 h-4 w-4" />
          Upload Your First Document
        </Button>
      </Link>
    </div>
  );
}

function SavedTabContent({ documents, isLoading, error }: TabContentProps) {
  // TODO: Replace with actual saved documents logic and loading state
  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <p>Loading saved documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="border-destructive bg-destructive/10 text-destructive flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed p-4 text-center">
        <p className="font-medium">Error loading saved documents</p>
        <p className="mt-1 text-sm">{(error as Error).message}</p>
      </div>
    );
  }

  if (documents.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Saved Documents ({documents.length})
          </h2>
          <Link href="/documents">
            <Button variant="outline" size="sm">
              Browse More
            </Button>
          </Link>
        </div>
        <DocumentsGrid documents={documents} />
      </div>
    );
  }

  // Empty state
  return (
    <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center">
      <BookmarkIcon className="text-muted-foreground mb-4 h-12 w-12" />
      <h3 className="mb-2 text-lg font-medium">No saved documents</h3>
      <p className="text-muted-foreground mb-4 max-w-sm">
        Save documents you find useful to access them quickly later.
      </p>
      <Link href="/documents">
        <Button>Browse Documents</Button>
      </Link>
    </div>
  );
}

// --- Main Page Component --- //

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("uploads");
  const { data: session, isPending: isLoadingSession } =
    authClient.useSession();
  const user = session?.user as User;

  const { data: userDocuments = [], isLoading: isLoadingDocuments } = useQuery<
    FetchedUserDocument[],
    Error
  >({
    queryKey: ["userDocuments", user?.id],
    queryFn: fetchUserDocuments,
    staleTime: 5 * 60 * 1000, // Cache for 5 mins
    enabled: !!user,
  });

  const {
    data: userStats = { uploads: 0, downloads: 0, savedDocuments: 0 },
    isLoading: isLoadingStats,
  } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: fetchUserStats,
    staleTime: 5 * 60 * 1000,
    enabled: !!user,
  });

  const { data: savedDocumentsPlaceholder = [], isLoading: isLoadingSaved } =
    useQuery<FetchedUserDocument[], Error>({
      queryKey: ["savedDocuments", user?.id],
      queryFn: async () => {
        const response = await fetch("/api/user/saved-documents");
        if (!response.ok) {
          throw new Error("Failed to fetch saved documents");
        }
        return response.json();
      },
      staleTime: 5 * 60 * 1000,
      enabled: !!user && activeTab === "saved",
    });

  // Could add a state if session load failed or no user
  if (!user && !isLoadingSession) {
    return (
      <div className="container mx-auto flex h-[calc(100vh-200px)] items-center justify-center p-4 md:p-6">
        <div className="text-center">
          <p className="text-lg font-medium">Please log in</p>
          <p className="text-muted-foreground mb-4">
            You need to be logged in to view your library.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-6">
      <ProfileHeader user={user} isLoading={isLoadingSession} />
      <ProfileStats stats={userStats} isLoading={isLoadingStats} />

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
          <UploadsTabContent
            documents={userDocuments}
            isLoading={isLoadingDocuments}
            error={null}
          />
        </TabsContent>

        <TabsContent value="saved" className="mt-6">
          <SavedTabContent
            documents={savedDocumentsPlaceholder}
            isLoading={isLoadingSaved}
            error={null}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
