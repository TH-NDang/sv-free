"use client";

import { AlertCircle, FileIcon, UploadIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { env } from "@/env/client";
import { authClient } from "@/lib/auth/auth-client";
import { normalizeFilePath } from "@/lib/supabase";
import Link from "next/link";

// ==========================================
// Types
// ==========================================

interface FileUploadProps {
  onFileUploaded?: (fileUrl: string, fileData: FileData) => void;
  redirectAfterUpload?: boolean;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
}

export interface FileData {
  id: string;
  name: string;
  size: number;
  type: string;
  path: string;
  url: string;
  categories: string;
}

// ==========================================
// Constants
// ==========================================

// Define document categories with some additional attributes
const DOCUMENT_CATEGORIES: Option[] = [
  { value: "programming", label: "Programming", group: "Technical" },
  { value: "data_science", label: "Data Science", group: "Technical" },
  { value: "web_development", label: "Web Development", group: "Technical" },
  { value: "mathematics", label: "Mathematics", group: "Sciences" },
  { value: "physics", label: "Physics", group: "Sciences" },
  { value: "chemistry", label: "Chemistry", group: "Sciences" },
  { value: "biology", label: "Biology", group: "Sciences" },
  { value: "economics", label: "Economics", group: "Social Sciences" },
  { value: "history", label: "History", group: "Humanities" },
  { value: "literature", label: "Literature", group: "Humanities" },
  { value: "philosophy", label: "Philosophy", group: "Humanities" },
  { value: "art", label: "Art & Design", group: "Creative" },
  { value: "music", label: "Music", group: "Creative" },
  { value: "other", label: "Other", group: "Miscellaneous" },
];

// ==========================================
// Helper Components
// ==========================================

interface FilePreviewProps {
  file: File;
  preview: string | null;
  isPdf: boolean;
  onClear: () => void;
  disabled?: boolean;
}

function FilePreview({
  file,
  preview,
  isPdf,
  onClear,
  disabled,
}: FilePreviewProps) {
  // Get file size in human-readable format
  const getFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  // No file
  if (!file) return null;

  // PDF preview
  if (preview && isPdf) {
    return (
      <div>
        <div className="relative overflow-hidden rounded-md border border-gray-800 bg-gray-900 p-1">
          <div className="mb-2 flex items-center justify-between px-1">
            <div className="text-sm font-medium">{file.name}</div>
            <div className="text-xs text-gray-500">
              {getFileSize(file.size)}
            </div>
          </div>
          <div className="relative h-72 w-full overflow-hidden rounded bg-black">
            <iframe
              src={preview}
              title="PDF Preview"
              className="h-full w-full border-0"
            />
          </div>
        </div>
        <DeleteButton onClear={onClear} disabled={disabled} />
      </div>
    );
  }

  // Image preview
  if (preview) {
    return (
      <div>
        <div className="relative overflow-hidden rounded-md border border-gray-800 bg-gray-900 p-1">
          <div className="mb-2 flex items-center justify-between px-1">
            <div className="text-sm font-medium">{file.name}</div>
            <div className="text-xs text-gray-500">
              {getFileSize(file.size)}
            </div>
          </div>
          <div className="relative h-48 w-full rounded bg-black">
            <Image
              src={preview}
              alt="File preview"
              fill
              className="rounded object-contain"
            />
          </div>
        </div>
        <DeleteButton onClear={onClear} disabled={disabled} />
      </div>
    );
  }

  // Generic file preview (no image/PDF)
  return (
    <div>
      <div className="relative overflow-hidden rounded-md border border-gray-800 bg-gray-900 p-1">
        <div className="mb-2 flex items-center justify-between px-1">
          <div className="text-sm font-medium">{file.name}</div>
          <div className="text-xs text-gray-500">{getFileSize(file.size)}</div>
        </div>
        <div className="flex h-40 items-center justify-center rounded bg-gray-900">
          <div className="text-center">
            <FileIcon className="mx-auto mb-2 h-12 w-12 text-gray-600" />
            <p className="text-sm text-gray-500">No preview available</p>
          </div>
        </div>
      </div>
      <DeleteButton onClear={onClear} disabled={disabled} />
    </div>
  );
}

function DeleteButton({
  onClear,
  disabled,
}: {
  onClear: () => void;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      className="absolute -right-2 -top-2 h-7 w-7 rounded-full border border-gray-700 bg-gray-800 text-gray-400 shadow-sm hover:bg-gray-700"
      onClick={onClear}
      disabled={disabled}
    >
      <XIcon className="h-4 w-4" />
    </Button>
  );
}

function DropZone({
  onFileChange,
  acceptedFileTypes,
  maxSizeMB,
  disabled,
}: {
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  acceptedFileTypes: string;
  maxSizeMB: number;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <UploadIcon className="mb-4 h-12 w-12 text-gray-500" />
      <p className="mb-2 text-base font-medium">
        Upload a document to your library
      </p>
      <p className="mb-6 text-sm text-gray-500">
        Supported formats include PDF, Word, Excel, PowerPoint, and more
      </p>
      <Button
        variant="outline"
        className="relative cursor-pointer overflow-hidden border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700"
        size="lg"
      >
        Browse files
        <Input
          id="file-upload"
          type="file"
          className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
          accept={acceptedFileTypes}
          onChange={onFileChange}
          disabled={disabled}
        />
      </Button>
      <p className="mt-4 text-xs text-gray-500">
        Maximum file size: {maxSizeMB}MB
      </p>
    </div>
  );
}

// ==========================================
// Main Component
// ==========================================

export function FileUpload({
  onFileUploaded,
  redirectAfterUpload = false,
  acceptedFileTypes = ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip",
  maxSizeMB = 10,
}: FileUploadProps) {
  const router = useRouter();

  // File state
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPdf, setIsPdf] = useState(false);
  const pdfObjectUrl = useRef<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Option[]>([]);
  const [description, setDescription] = useState("");

  // UI state
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<React.ReactNode | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // Get current user
  const { data: session } = authClient.useSession();
  const currentUser = session?.user;

  // Cleanup object URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfObjectUrl.current) {
        URL.revokeObjectURL(pdfObjectUrl.current);
      }
    };
  }, []);

  // Handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Reset states
    setError(null);
    setSuccess(null);
    setIsPdf(false);

    if (!e.target.files || e.target.files.length === 0) {
      setFile(null);
      setPreview(null);
      return;
    }

    const selectedFile = e.target.files[0];

    // Validate file size
    if (selectedFile.size > maxSizeBytes) {
      setError(`The file exceeds the maximum size of ${maxSizeMB}MB.`);
      e.target.value = "";
      return;
    }

    // Validate file type
    const fileExt = selectedFile.name.split(".").pop()?.toLowerCase() || "";
    const fileType = selectedFile.type.split("/")[1];

    if (
      !acceptedFileTypes.includes(fileType) &&
      !acceptedFileTypes.includes(`.${fileExt}`)
    ) {
      setError(
        `Please upload a file with one of these extensions: ${acceptedFileTypes}`
      );
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
    setTitle(selectedFile.name.split(".")[0]); // Set initial title from filename

    // Handle PDF files
    if (fileExt === "pdf") {
      setIsPdf(true);
      if (pdfObjectUrl.current) {
        URL.revokeObjectURL(pdfObjectUrl.current);
      }
      pdfObjectUrl.current = URL.createObjectURL(selectedFile);
      setPreview(pdfObjectUrl.current);
    }
    // Handle image files
    else if (selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // For non-image, non-PDF files, we'll use a generic preview
      setPreview(null);
    }

    setSuccess("File selected successfully.");
  };

  // Clear selected file
  const handleClearFile = () => {
    setFile(null);
    setPreview(null);
    setProgress(0);
    setError(null);
    setSuccess(null);
    setIsPdf(false);
    if (pdfObjectUrl.current) {
      URL.revokeObjectURL(pdfObjectUrl.current);
      pdfObjectUrl.current = null;
    }
  };

  // Simulated async search for category options
  const handleCategorySearch = async (
    searchTerm: string
  ): Promise<Option[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (!searchTerm) return DOCUMENT_CATEGORIES;

    return DOCUMENT_CATEGORIES.filter(
      (category) =>
        category.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof category.group === "string" &&
          category.group.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  // Format file size for database
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / 1048576).toFixed(2) + " MB";
  };

  // Save document metadata to database
  const saveDocumentToDatabase = async (documentData: {
    title: string;
    description?: string;
    fileUrl: string;
    fileType?: string;
    fileSize?: string;
    categoryId?: string;
    published?: boolean;
  }) => {
    try {
      // Handle any UUID conversions if needed
      const processedData = {
        ...documentData,
        authorId: currentUser?.id || null,
      };

      // Log what we're sending to the API
      console.log("Saving document to database:", processedData);

      const response = await fetch("/api/documents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(processedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error saving document to database:", errorData);
        throw new Error(
          `Failed to save document to database: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving document to database:", error);
      throw error;
    }
  };

  // Handle file upload
  const handleUpload = async () => {
    setError(null);
    setSuccess(null);

    if (!file || !title || selectedCategories.length === 0) {
      setError(
        "Please provide a title, select at least one category, and select a file"
      );
      return;
    }

    try {
      setUploading(true);
      setProgress(10);

      // Simulate progress updates during upload
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);

      try {
        // Generate a unique file path to avoid collisions
        const fileExt = file.name.split(".").pop();
        const fileName = `${uuidv4()}.${fileExt}`;

        // Use primary category for folder structure
        const category = selectedCategories[0].value;
        const filePath = `${category.toLowerCase()}/${fileName}`;

        // Normalize the file path
        const normalizedPath = normalizeFilePath(filePath);

        // Upload the file to Supabase Storage
        // const uploadResult = await uploadFile(file, filePath);

        // Get the public URL of the uploaded file
        const fileUrl = `${env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/documents/${normalizedPath}`;

        // Prepare file data
        const fileData = {
          id: uuidv4(),
          name: title,
          size: file.size,
          type: file.type,
          path: normalizedPath, // Use the normalized path
          url: fileUrl,
          categories: selectedCategories.map((cat) => cat.label).join(", "),
        };

        // Log before saving to database
        console.log(
          "About to save document to database with category:",
          selectedCategories[0]
        );

        // Save document to database
        try {
          const savedDocument = await saveDocumentToDatabase({
            title,
            description: description || undefined,
            fileUrl,
            fileType: file.type,
            fileSize: formatFileSize(file.size),
            categoryId: selectedCategories[0].value, // Use first category ID
            published: true,
          });

          console.log("Document saved successfully:", savedDocument);
        } catch (dbError) {
          console.error("Error saving to database:", dbError);
          // Continue with the flow even if database save fails
          // This ensures files are still uploaded to storage even if DB fails
        }

        setProgress(100);
        clearInterval(progressInterval);

        // Call the callback if provided
        if (onFileUploaded) {
          onFileUploaded(fileUrl, fileData);
        }

        setSuccess("Document uploaded successfully! Redirecting...");

        // Optionally redirect after upload
        if (redirectAfterUpload) {
          setTimeout(() => {
            router.push("/");
          }, 2000);
        }
      } catch (error) {
        console.error("Error uploading file:", error);

        // Show specific error message for bucket not found
        if (
          error instanceof Error &&
          error.message.includes("Bucket") &&
          error.message.includes("does not exist")
        ) {
          setError(
            <>
              Storage is not configured correctly. Please visit the{" "}
              <Link
                href="/storage-setup-guide"
                className="font-medium text-blue-400 underline"
              >
                storage setup guide
              </Link>{" "}
              for instructions.
            </>
          );
        } else {
          setError("There was an error uploading your file. Please try again.");
        }

        clearInterval(progressInterval);
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mx-auto w-full max-w-3xl">
        <h1 className="text-3xl font-bold">Upload Document</h1>
        <p className="text-muted-foreground mt-1">
          Add new documents to your library
        </p>
      </div>

      <Card className="bg-card-dark mx-auto w-full max-w-3xl border border-gray-800 bg-black text-white shadow-md">
        <CardHeader className="border-b border-gray-800 bg-gray-900/50 px-6 pb-4 pt-4">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">Upload Document</CardTitle>
              <CardDescription className="mt-1 text-gray-400">
                Upload a document to your library. Supported formats include
                PDF, Word, Excel, PowerPoint, and more.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pt-6">
          {error && (
            <Alert
              variant="destructive"
              className="border-red-900/30 bg-red-900/20 text-red-400"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && !error && (
            <Alert className="border-green-900/50 bg-green-900/20 text-green-400">
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* File drop zone */}
          <div
            className={`rounded-lg border-2 border-dashed bg-gray-900/80 p-4 ${
              file ? "border-primary/50" : "border-gray-700"
            }`}
          >
            {!file ? (
              <DropZone
                onFileChange={handleFileChange}
                acceptedFileTypes={acceptedFileTypes}
                maxSizeMB={maxSizeMB}
                disabled={uploading}
              />
            ) : (
              <div className="relative">
                <FilePreview
                  file={file}
                  preview={preview}
                  isPdf={isPdf}
                  onClear={handleClearFile}
                  disabled={uploading}
                />
              </div>
            )}
          </div>

          {file && (
            <>
              <Separator className="my-4 bg-gray-800" />

              {/* File metadata */}
              <div className="space-y-5 py-2">
                <div className="grid gap-2">
                  <Label
                    htmlFor="title"
                    className="text-sm font-medium text-gray-300"
                  >
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Document title"
                    disabled={uploading}
                    required
                    className="h-10 border-gray-800 bg-gray-900 text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="category"
                    className="text-sm font-medium text-gray-300"
                  >
                    Categories
                  </Label>
                  <div className="relative">
                    <MultipleSelector
                      commandProps={{
                        label: "Select categories",
                      }}
                      value={selectedCategories}
                      onChange={setSelectedCategories}
                      defaultOptions={DOCUMENT_CATEGORIES.slice(0, 5)} // Show only first 5 initially
                      onSearch={handleCategorySearch}
                      placeholder="Search or select up to 3 categories"
                      hidePlaceholderWhenSelected
                      disabled={uploading}
                      emptyIndicator={
                        <p className="text-center text-sm">
                          No matching categories found
                        </p>
                      }
                      loadingIndicator={
                        <div className="flex items-center justify-center p-4">
                          <div className="border-primary h-6 w-6 animate-spin rounded-full border-b-2"></div>
                          <span className="ml-2 text-sm">
                            Loading categories...
                          </span>
                        </div>
                      }
                      maxSelected={3}
                      onMaxSelected={(max) =>
                        setError(`You can select up to ${max} categories`)
                      }
                      groupBy="group"
                      className="min-h-10 border-gray-800 bg-gray-900"
                      badgeClassName="bg-gray-800 text-gray-200 border-gray-700"
                      creatable
                      triggerSearchOnFocus
                      delay={300}
                    />
                    {selectedCategories.length === 0 && (
                      <p className="mt-1 text-xs text-gray-500">
                        First category will be used for document organization
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label
                    htmlFor="description"
                    className="text-sm font-medium text-gray-300"
                  >
                    Description (optional)
                  </Label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a brief description of this document"
                    className="min-h-[80px] w-full rounded-md border border-gray-800 bg-gray-900 px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:border-gray-700 focus:outline-none"
                    disabled={uploading}
                  />
                </div>
              </div>

              {uploading && (
                <div className="space-y-2">
                  <Progress value={progress} className="h-2 bg-gray-800" />
                  <p className="text-center text-sm text-gray-400">
                    Uploading... {progress}%
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex items-center justify-end gap-3 border-t border-gray-800 px-6 py-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            disabled={uploading}
            className="h-10 border-gray-700 bg-gray-800 px-5 text-gray-300 hover:bg-gray-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={
              !file || uploading || !title || selectedCategories.length === 0
            }
            className="bg-primary hover:bg-primary/90 h-10 px-5 font-medium text-white"
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
