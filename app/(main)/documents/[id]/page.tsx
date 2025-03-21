"use client";

import {
  ArrowLeftIcon,
  BookmarkIcon,
  CalendarIcon,
  DownloadIcon,
  EyeIcon,
  FileIcon,
  ShareIcon,
  UserIcon,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Document, generateSampleDocuments } from "@/app/(main)/types/document";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);

  // Simulate fetching document data
  useEffect(() => {
    const fetchDocument = async () => {
      setLoading(true);
      try {
        // In a real app, you'd fetch from an API
        // For demo purposes, we'll use our generated samples
        const documents = generateSampleDocuments(20);
        const doc = documents.find((d) => d.id === params.id);

        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (doc) {
          setDocument(doc);
        } else {
          // Document not found
          // In production, you might want to redirect to a 404 page
          console.error("Document not found");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDocument();
    }
  }, [params.id]);

  const handleGoBack = () => {
    router.back();
  };

  if (loading) {
    return <DocumentDetailSkeleton />;
  }

  if (!document) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <FileIcon className="text-muted-foreground h-16 w-16" />
        <h1 className="mt-4 text-2xl font-bold">Document Not Found</h1>
        <p className="text-muted-foreground mt-2 text-center">
          The document you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Button onClick={handleGoBack} className="mt-6">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-6 p-6">
      {/* Header with back button and actions */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleGoBack}>
            <ArrowLeftIcon className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{document.title}</h1>
            <p className="text-muted-foreground">{document.category}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <EyeIcon className="mr-2 h-4 w-4" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <ShareIcon className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            <BookmarkIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Document details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left side - document preview */}
        <div className="lg:col-span-2">
          <Card>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="min-h-[500px]">
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                  {/* This would be a PDF viewer or document preview in a real app */}
                  <Image
                    src={document.thumbnailUrl}
                    alt={document.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <Button>
                      <EyeIcon className="mr-2 h-4 w-4" />
                      View Full Document
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details">
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                      <div className="text-muted-foreground">Title</div>
                      <div>{document.title}</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                      <div className="text-muted-foreground">Description</div>
                      <div>{document.description}</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                      <div className="text-muted-foreground">Category</div>
                      <div>{document.category}</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                      <div className="text-muted-foreground">File Type</div>
                      <div>{document.fileType}</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                      <div className="text-muted-foreground">File Size</div>
                      <div>{document.fileSize}</div>
                    </div>
                    <Separator />

                    <div className="grid grid-cols-[1fr_2fr] gap-4">
                      <div className="text-muted-foreground">Downloads</div>
                      <div>{document.downloadCount}</div>
                    </div>
                  </div>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Right side - document metadata */}
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-medium">Document Information</h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <UserIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">Author:</span>
                  <span className="ml-auto">{document.author}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CalendarIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">Uploaded:</span>
                  <span className="ml-auto">
                    {new Date(document.uploadDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <FileIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">File Type:</span>
                  <span className="ml-auto">{document.fileType}</span>
                </div>

                <div className="flex items-center gap-2">
                  <DownloadIcon className="text-muted-foreground h-4 w-4" />
                  <span className="text-muted-foreground">Downloads:</span>
                  <span className="ml-auto">{document.downloadCount}</span>
                </div>

                <Separator />

                <div className="flex flex-col gap-2">
                  <h4 className="font-medium">Actions</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <Button className="w-full">
                      <DownloadIcon className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" className="w-full">
                      <ShareIcon className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DocumentDetailSkeleton() {
  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="mt-2 h-4 w-32" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="aspect-video w-full" />
          </Card>
        </div>

        <div>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="mb-4 h-6 w-40" />
              <div className="flex flex-col gap-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="ml-auto h-4 w-32" />
                    </div>
                  ))}
                <Skeleton className="h-0.5 w-full" />
                <Skeleton className="h-6 w-32" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-10 w-full rounded-md" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
