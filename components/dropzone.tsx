"use client";

import { Button } from "@/components/ui/button";
import { type UseSupabaseUploadReturn } from "@/hooks/use-supabase-upload";
import { cn } from "@/lib/utils";
import { CheckCircle, File, Upload, X } from "lucide-react";
import Image from "next/image";
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
} from "react";

export const formatBytes = (
  bytes: number,
  decimals = 2,
  size?: "bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"
) => {
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (bytes === 0 || bytes === undefined)
    return size !== undefined ? `0 ${size}` : "0 bytes";
  const i =
    size !== undefined
      ? sizes.indexOf(size)
      : Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

type DropzoneContextType = Omit<
  UseSupabaseUploadReturn,
  "getRootProps" | "getInputProps"
>;

const DropzoneContext = createContext<DropzoneContextType | undefined>(
  undefined
);

type DropzoneProps = UseSupabaseUploadReturn & {
  className?: string;
};

const Dropzone = ({
  className,
  children,
  getRootProps,
  getInputProps,
  ...restProps
}: PropsWithChildren<DropzoneProps>) => {
  const isSuccess = restProps.isSuccess;
  const isActive = restProps.isDragActive;
  const isInvalid =
    (restProps.isDragActive && restProps.isDragReject) ||
    (restProps.errors.length > 0 && !restProps.isSuccess) ||
    restProps.files.some((file) => file.errors.length !== 0);

  return (
    <DropzoneContext.Provider value={{ ...restProps }}>
      <div
        {...getRootProps({
          className: cn(
            "border-2 border-gray-300 rounded-lg p-6 text-center bg-card transition-colors duration-300 text-foreground",
            className,
            isSuccess ? "border-solid" : "border-dashed",
            isActive && "border-primary bg-primary/10",
            isInvalid && "border-destructive bg-destructive/10"
          ),
        })}
      >
        <input {...getInputProps()} />
        {children}
      </div>
    </DropzoneContext.Provider>
  );
};
const DropzoneContent = ({ className }: { className?: string }) => {
  const {
    files,
    setFiles,
    loading,
    successes,
    errors,
    maxFileSize,
    maxFiles,
    isSuccess,
  } = useDropzoneContext();

  const exceedMaxFiles = files.length > maxFiles;

  const handleRemoveFile = useCallback(
    (fileName: string) => {
      setFiles(files.filter((file) => file.name !== fileName));
    },
    [files, setFiles]
  );

  if (isSuccess) {
    return (
      <div
        className={cn(
          "flex flex-row items-center justify-center gap-x-2",
          className
        )}
      >
        <CheckCircle size={16} className="text-primary" />
        <p className="text-primary text-sm">
          Successfully uploaded {files.length} file{files.length > 1 ? "s" : ""}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {files.map((file, idx) => {
        const fileError = errors.find((e) => e.name === file.name);
        const isSuccessfullyUploaded = !!successes.find((e) => e === file.name);

        return (
          <div
            key={`${file.name}-${idx}`}
            className="flex items-center gap-x-4 border-b py-2 first:mt-4 last:mb-4 "
          >
            {file.type.startsWith("image/") ? (
              <div className="bg-muted flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded border">
                <Image
                  src={file.preview || ""}
                  alt={file.name}
                  className="object-cover"
                  width={40}
                  height={40}
                />
              </div>
            ) : (
              <div className="bg-muted flex h-10 w-10 items-center justify-center rounded border">
                <File size={18} />
              </div>
            )}

            <div className="flex shrink grow flex-col items-start truncate">
              <p title={file.name} className="max-w-full truncate text-sm">
                {file.name}
              </p>
              {file.errors.length > 0 ? (
                <p className="text-destructive text-xs">
                  {file.errors
                    .map((e) =>
                      e.message.startsWith("File is larger than")
                        ? `File is larger than ${formatBytes(maxFileSize, 2)} (Size: ${formatBytes(file.size, 2)})`
                        : e.message
                    )
                    .join(", ")}
                </p>
              ) : loading && !isSuccessfullyUploaded ? (
                <p className="text-muted-foreground text-xs">
                  Uploading file...
                </p>
              ) : !!fileError ? (
                <p className="text-destructive text-xs">
                  Failed to upload: {fileError.message}
                </p>
              ) : isSuccessfullyUploaded ? (
                <p className="text-primary text-xs">
                  Successfully uploaded file
                </p>
              ) : (
                <p className="text-muted-foreground text-xs">
                  {formatBytes(file.size, 2)}
                </p>
              )}
            </div>

            {!loading && !isSuccessfullyUploaded && (
              <Button
                size="icon"
                variant="link"
                className="text-muted-foreground hover:text-foreground shrink-0 justify-self-end"
                onClick={() => handleRemoveFile(file.name)}
              >
                <X />
              </Button>
            )}
          </div>
        );
      })}
      {exceedMaxFiles && (
        <p className="text-destructive mt-2 text-left text-sm">
          You may upload only up to {maxFiles} files, please remove{" "}
          {files.length - maxFiles} file
          {files.length - maxFiles > 1 ? "s" : ""}.
        </p>
      )}
      {/* Use onUpload hook to upload files */}
      {/* {files.length > 0 && !exceedMaxFiles && (
        <div className="mt-2">
          <Button
            variant="outline"
            onClick={onUpload}
            disabled={files.some((file) => file.errors.length !== 0) || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>Upload files</>
            )}
          </Button>
        </div>
      )} */}
    </div>
  );
};

const DropzoneEmptyState = ({ className }: { className?: string }) => {
  const { maxFiles, maxFileSize, inputRef, isSuccess } = useDropzoneContext();

  if (isSuccess) {
    return null;
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer flex-col items-center gap-y-2",
        className
      )}
      onClick={() => inputRef.current?.click()}
    >
      <Upload size={20} className="text-muted-foreground" />
      <p className="text-sm">
        Upload{!!maxFiles && maxFiles > 1 ? ` ${maxFiles}` : ""} file
        {!maxFiles || maxFiles > 1 ? "s" : ""}
      </p>
      <div className="flex flex-col items-center gap-y-1">
        <p className="text-muted-foreground text-xs">
          Drag and drop or{" "}
          <span className="hover:text-foreground underline transition">
            select {maxFiles === 1 ? `file` : "files"}
          </span>{" "}
          to upload
        </p>
        {maxFileSize !== Number.POSITIVE_INFINITY && (
          <p className="text-muted-foreground text-xs">
            Maximum file size: {formatBytes(maxFileSize, 2)}
          </p>
        )}
      </div>
    </div>
  );
};

const useDropzoneContext = () => {
  const context = useContext(DropzoneContext);

  if (!context) {
    throw new Error("useDropzoneContext must be used within a Dropzone");
  }

  return context;
};

export { Dropzone, DropzoneContent, DropzoneEmptyState, useDropzoneContext };
