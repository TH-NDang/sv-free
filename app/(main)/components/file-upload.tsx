"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
import { useSupabaseUpload } from "@/hooks/use-supabase-upload";
import { createClient } from "@/lib/supabase/client";
import { getMimeType } from "@/lib/utils";
import { PdfPreview } from "./pdf-preview";

export interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  url: string;
  categories: string;
}

/**
 * Custom hook for category search and fetching from API
 */
const useCategorySearch = () => {
  // Fetch all categories from the API
  const fetchCategories = async (): Promise<Option[]> => {
    try {
      const response = await fetch("/api/categories");

      if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.statusText}`);
      }

      const data = await response.json();

      // Transform categories from DB format to Option format
      return data.map(
        (category: { id: string; name: string; description?: string }) => ({
          value: category.id,
          label: category.name,
          group: "Categories",
          description: category.description || undefined,
        })
      );
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      toast.error("Không thể tải danh sách danh mục");
      return [];
    }
  };

  const { data: categoryOptions = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Handle search within the already fetched categories
  const handleSearch = async (searchTerm: string): Promise<Option[]> => {
    // Simulate network delay for search
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!searchTerm) return categoryOptions;

    return categoryOptions.filter(
      (category) =>
        category.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof category.group === "string" &&
          category.group.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (category.description &&
          typeof category.description === "string" &&
          category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  return { handleSearch, categoryOptions, isLoading };
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
  const { handleSearch, categoryOptions } = useCategorySearch();

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
            disabled={disabled || isLoadingCategories}
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
  path = "",
}: {
  onFileUploaded?: (fileUrl: string, fileData: FileData) => void;
  redirectAfterUpload?: boolean;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  bucketName?: string;
  path?: string;
}) {
  const router = useRouter();
  const supabase = createClient();
  const { isLoading: isLoadingCategories } = useCategorySearch();

  // Convert file extensions to MIME types for Supabase upload
  const allowedMimeTypes = acceptedFileTypes.split(",").map((type) => {
    if (type.startsWith(".")) {
      return getMimeType(type.substring(1));
    }
    return type;
  });

  // Form state
  const [title, setTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [description, setDescription] = useState("");

  // UI state
  const [isPdf, setIsPdf] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Initialize Supabase upload hook with normalizeFilenames option
  const uploadProps = useSupabaseUpload({
    bucketName,
    path,
    allowedMimeTypes,
    maxFileSize: maxSizeMB * 1024 * 1024,
    maxFiles: 1,
    upsert: true,
    normalizeFilenames: true, // Enable filename normalization in the hook
  });

  const {
    files,
    onUpload: supabaseUpload,
    loading,
    getStoragePath,
    getNormalizedFilename,
  } = uploadProps;

  // Set PDF detection and initial title
  useEffect(() => {
    if (files.length > 0) {
      const file = files[0];
      setIsPdf(file.type === "application/pdf");

      // Set title from filename if not already set
      if (!title) {
        const filename = file.name.split(".")[0];
        setTitle(filename);
      }
    }
  }, [files, title]);

  // Handle file upload
  const handleUpload = async () => {
    // Validate required fields
    if (files.length === 0 || !title || selectedCategories.length === 0) {
      toast.error(
        "Please provide a title, select at least one category, and select a file"
      );
      return;
    }

    try {
      setUploading(true);
      toast.loading("Uploading document...", {
        id: "upload-toast",
        description: "Please wait while we upload your document.",
      });

      // Check if bucket exists and create it if it doesn't
      const { error: bucketError } =
        await supabase.storage.getBucket(bucketName);
      if (bucketError) {
        const { error } = await supabase.storage.createBucket(bucketName, {
          public: true,
        });

        if (error) {
          toast.error(`Failed to create storage bucket: ${error.message}`);
          throw new Error(error.message);
        }
      }

      await supabaseUpload();

      // Get the original file and its normalized name
      const file = files[0];
      const normalizedFileName = getNormalizedFilename(file.name);

      // Get the storage path (with normalized filename)
      const filePath = getStoragePath(file.name);

      // Get public URL
      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
      const fileUrl = data.publicUrl;

      // Document data to save to the database
      const documentData = {
        title,
        description: description || undefined,
        fileUrl,
        fileType: file.type,
        fileSize: `${Math.round(file.size / 1024)} KB`,
        categoryId: selectedCategories[0].value,
        published: true,
      };

      // Save document to database
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(documentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save document");
      }

      const result = await response.json();
      console.log("Document saved to database:", result);

      toast.success("Document uploaded successfully!", {
        id: "upload-toast",
        duration: 2000,
      });

      // Call the onFileUploaded callback if provided
      if (onFileUploaded) {
        onFileUploaded(fileUrl, {
          id: result.id,
          name: normalizedFileName, // Use normalized name for consistency
          size: file.size,
          type: file.type,
          path: filePath,
          url: fileUrl,
          categories: selectedCategories.map((c) => c.label).join(", "),
        });
      }

      setTimeout(() => {
        router.push("/my-library");
      }, 1500);
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
                Upload Document
              </CardTitle>
              <CardDescription className="mt-1 text-sm">
                Supported formats include PDF, Word, Excel, PowerPoint, and
                more.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 px-4 sm:px-6">
          {/* Dropzone with hidden upload button */}
          <div className="rounded-lg">
            <div className="dropzone-wrapper">
              <Dropzone {...uploadProps} className="rounded-lg border-0">
                <DropzoneEmptyState />
                <DropzoneContent />
              </Dropzone>

              {/* Custom PDF Preview */}
              {isPdf && files.length > 0 && <PdfPreview file={files[0]} />}
            </div>
          </div>

          {files.length > 0 && (
            <>
              <Separator className="my-4" />

              {/* File metadata form */}
              <DocumentMetadataForm
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                onError={(errorMsg) => toast.error(errorMsg)}
                disabled={loading || uploading}
                isLoadingCategories={isLoadingCategories}
              />
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-stretch space-y-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:space-x-3 sm:space-y-0 sm:px-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={loading || uploading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={
              files.length === 0 ||
              loading ||
              uploading ||
              !title ||
              selectedCategories.length === 0
            }
            className="w-full sm:w-auto"
          >
            {loading || uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
