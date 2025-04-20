"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

import { authClient } from "@/lib/auth-client";
import { createClient } from "@/lib/supabase/client";

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/dropzone";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MultipleSelector, { Option } from "@/components/ui/multiselect";
import { Separator } from "@/components/ui/separator";
import { useCategorySearch } from "@/hooks/use-category-search";
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { type Document } from "@/lib/db/schema";
import { PdfPreview } from "./pdf-preview";
import { getMimeType } from "@/lib/utils";

const mimeTypeMap: { [key: string]: string } = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  txt: "text/plain",
  zip: "application/zip",
};

/**
 * Document Metadata Form Component
 */
interface MetadataFormProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  selectedCategories: Option[];
  setSelectedCategories: (categories: Option[]) => void;
  onError: (error: string) => void;
  disabled: boolean;
  isLoadingCategories: boolean;
}

function DocumentMetadataForm({
  title,
  setTitle,
  description,
  setDescription,
  selectedCategories,
  setSelectedCategories,
  onError,
  disabled,
  isLoadingCategories,
}: MetadataFormProps) {
  const { handleSearch, categoryOptions, createCategory } = useCategorySearch();
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // Custom handler for creatable items
  const handleSelectCreateOption = async (inputValue: string) => {
    if (!inputValue) return;

    setIsCreatingCategory(true);
    try {
      // Create the category in the backend
      const newCategory = await createCategory(inputValue);

      if (newCategory) {
        // Add the new category to selected categories
        const updatedCategories = [...selectedCategories, newCategory];
        setSelectedCategories(updatedCategories);
        toast.success(`Đã tạo danh mục "${inputValue}"`);
      } else {
        // Show error message
        onError(`Không thể tạo danh mục "${inputValue}"`);
      }
    } catch (error) {
      console.error("Failed to create category:", error);
      onError(`Không thể tạo danh mục "${inputValue}"`);
    } finally {
      setIsCreatingCategory(false);
    }
  };

  return (
    <div className="space-y-5 py-2">
      <div className="grid gap-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title"
          disabled={disabled}
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="category">Categories</Label>
        <div className="relative">
          <MultipleSelector
            commandProps={{
              label: "Select categories",
            }}
            value={selectedCategories}
            onChange={setSelectedCategories}
            defaultOptions={categoryOptions.slice(0, 5)}
            onSearch={handleSearch}
            placeholder="Search or select up to 3 categories"
            hidePlaceholderWhenSelected
            disabled={disabled || isLoadingCategories || isCreatingCategory}
            emptyIndicator={
              <p className="text-center text-sm">
                No matching categories found
              </p>
            }
            loadingIndicator={
              <div className="flex items-center justify-center p-4">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2"></div>
                <span className="ml-2 text-sm">Loading categories...</span>
              </div>
            }
            maxSelected={3}
            onMaxSelected={(max) =>
              onError(`You can select up to ${max} categories`)
            }
            groupBy="group"
            creatable
            onCreateOption={handleSelectCreateOption}
            triggerSearchOnFocus
            delay={300}
          />
          {selectedCategories.length === 0 && (
            <p className="text-muted-foreground mt-1 text-xs">
              First category will be used for document organization
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="description">Description (optional)</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide a brief description of this document"
          className="min-h-[80px] w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export function FileUpload({
  onFileUploaded,
  acceptedFileTypes = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip",
  maxSizeMB = 10,
  bucketName = "documents",
  redirectAfterUpload = false,
  path,
}: {
  onFileUploaded?: (fileData: Document) => void;
  redirectAfterUpload?: boolean;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  bucketName?: string;
  path?: string;
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const supabase = createClient();
  const { data: session, isPending: isLoadingSession } =
    authClient.useSession();
  const userId = session?.user?.id;

  const { isLoading: isLoadingCategories } = useCategorySearch();

  const allowedMimeTypes = acceptedFileTypes
    .split(",")
    .map((type) => type.trim())
    .map((type) => {
      if (type.startsWith(".")) {
        const extension = type.substring(1);
        // Use explicit map first. Fallback could be added if needed.
        return mimeTypeMap[extension];
      }
      // If it's already a MIME type, return it directly
      return type;
    })
    .filter((mime): mime is string => !!mime); // Filter out null/undefined results

  const [title, setTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [description, setDescription] = useState("");
  const [isPdf, setIsPdf] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);

  useEffect(() => {
    if (userId && !documentId) {
      setDocumentId(uuidv4());
    }
  }, [userId, documentId]);

  const isProcessing = isLoadingCategories || uploading || isLoadingSession;

  const uploadProps = useSupabaseUpload({
    bucketName,
    path,
    allowedMimeTypes,
    maxFileSize: maxSizeMB * 1024 * 1024,
    maxFiles: 1,
    upsert: true,
  });

  const {
    files,
    loading: isLoadingHookState,
    open: openFileDialog,
  } = uploadProps;

  useEffect(() => {
    if (files.length > 0) {
      const file = files[0];
      setIsPdf(file.type === "application/pdf");
      if (!title) {
        const filenameWithoutExt =
          file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
        setTitle(filenameWithoutExt);
      }
    }
  }, [files, title]);

  const getDynamicPath = (fileName: string) => {
    if (!userId || !documentId) return null;
    const extension = fileName.split(".").pop();
    return `user_${userId}/${path ? `${path}/` : ""}${documentId}.${extension}`;
  };

  const handleUpload = async () => {
    if (!userId || !documentId) {
      toast.error(
        "User session not loaded or document ID not generated. Please try again."
      );
      return;
    }

    if (files.length === 0 || !title || selectedCategories.length === 0) {
      toast.error(
        "Please provide a title, select at least one category, and select a file"
      );
      return;
    }

    const file = files[0];
    const storagePath = getDynamicPath(file.name);
    if (!storagePath) {
      toast.error("Could not generate storage path. Please try again.");
      return;
    }

    // const thumbnailStoragePath = `user_${userId}/${path ? `${path}/` : ""}${documentId}.webp`;

    try {
      setUploading(true);
      toast.loading("Uploading document...", {
        id: "upload-toast",
        description: "Please wait while we upload your document.",
      });

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error("Supabase upload error:", uploadError);
        throw new Error(`Failed to upload: ${uploadError.message}`);
      }

      // const thumbnailResponse = await fetch("/api/generate-thumbnail", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     documentId: documentId,
      //     storagePath: storagePath,
      //     thumbnailStoragePath: thumbnailStoragePath,
      //     originalFilename: file.name,
      //   }),
      // });

      // let finalThumbnailPath: string | null = null;
      // if (thumbnailResponse.ok) {
      //   const thumbnailData = await thumbnailResponse.json();
      //   finalThumbnailPath =
      //     thumbnailData.thumbnailStoragePath || thumbnailStoragePath;
      // } else {
      //   let thumbErrorMsg = "Thumbnail generation failed or skipped.";
      //   try {
      //     const err = await thumbnailResponse.json();
      //     thumbErrorMsg = err.message || err.error || thumbErrorMsg;
      //   } catch {
      //     /* ignore */
      //   }
      //   console.warn("Thumbnail generation error:", thumbErrorMsg);
      // }

      const documentDataToSave = {
        id: documentId,
        title,
        description: description || undefined,
        originalFilename: file.name,
        storagePath: storagePath,
        fileType: file.type || getMimeType(file.name.split(".").pop() || ""),
        fileSize: file.size,
        // thumbnailStoragePath: finalThumbnailPath,
        thumbnailStoragePath: null,
        categoryId: selectedCategories[0].value,
      };

      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documentDataToSave),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to save document metadata"
        );
      }

      const savedDocument = await response.json();

      toast.success("Document uploaded successfully!", {
        id: "upload-toast",
        duration: 2000,
      });

      if (onFileUploaded) {
        onFileUploaded(savedDocument);
      }

      queryClient.invalidateQueries({ queryKey: ["userDocuments", userId] });

      if (redirectAfterUpload) {
        setTimeout(() => {
          router.push("/my-library");
        }, 1500);
      }
    } catch (error) {
      console.error("Error in upload process:", error);
      toast.error(
        `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        { id: "upload-toast" }
      );
    } finally {
      setUploading(false);
    }
  };

  // Handle click manually to check disabled state
  const handleOpenFileDialog = () => {
    if (!isProcessing) {
      openFileDialog();
    }
  };

  return (
    <div className="w-full px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-2xl font-bold md:text-3xl">Upload Document</h1>
        <p className="text-muted-foreground mt-1 text-sm md:text-base">
          Add new documents to your library
        </p>
      </div>

      <Card className="mx-auto mt-6 w-full max-w-3xl">
        <CardHeader className="px-4 py-4 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-2 sm:flex-row">
            <div>
              <CardTitle className="text-lg sm:text-xl">
                1. Select File
              </CardTitle>
              <CardDescription className="mt-1 text-sm">
                Choose the document you want to upload (Max {maxSizeMB}MB).
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6">
          <div className="rounded-lg">
            <div className="dropzone-wrapper">
              <Dropzone
                {...uploadProps}
                open={handleOpenFileDialog}
                className="rounded-lg border-0"
              >
                <DropzoneEmptyState />
                <DropzoneContent />
              </Dropzone>
              {isPdf && files.length > 0 && <PdfPreview file={files[0]} />}
            </div>
          </div>

          {files.length > 0 && (
            <>
              <Separator className="my-6" />
              <div>
                <CardTitle className="mb-2 text-lg sm:text-xl">
                  2. Add Details
                </CardTitle>
                <CardDescription className="mb-4 text-sm">
                  Provide information about your document.
                </CardDescription>
                <DocumentMetadataForm
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  onError={(errorMsg) => toast.error(errorMsg)}
                  disabled={isProcessing}
                  isLoadingCategories={isLoadingCategories}
                />
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch space-y-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:space-x-3 sm:space-y-0 sm:px-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={
              !userId ||
              files.length === 0 ||
              isProcessing ||
              !title ||
              selectedCategories.length === 0
            }
            className="w-full sm:w-auto"
          >
            {uploading
              ? "Uploading..."
              : isLoadingHookState
                ? "Processing..."
                : "Upload Document"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
