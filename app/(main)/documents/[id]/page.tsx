"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeftIcon,
  BookmarkIcon,
  CalendarIcon,
  DownloadIcon,
  EyeIcon,
  FileIcon,
  ShareIcon,
  StarIcon,
  UserIcon,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, Key, useEffect, useState } from "react";
import { toast } from "sonner";

import { DocumentViewer } from "@/components/document-viewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DocumentWithDetails } from "@/lib/db/queries";
import { formatFileSize, getDisplayExtension } from "@/lib/utils";

type FetchedDocument = DocumentWithDetails & {
  fileUrl: string | null;
  thumbnailUrl: string | null;
};

const fetchDocument = async (id: string): Promise<FetchedDocument[]> => {
  const response = await fetch(`/api/documents/${id}`);

  if (!response.ok) {
    let errorMsg = "Không thể lấy thông tin tài liệu";
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorData.error || errorMsg;
    } catch {
      /* Ignore parsing error */
    }
    throw new Error(errorMsg);
  }

  return response.json();
};

function DocumentDetailSkeleton() {
  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-md" />
          <div className="min-w-0">
            <Skeleton className="h-7 w-48 md:w-72" />
            <Skeleton className="mt-1.5 h-4 w-24" />
          </div>
        </div>
        <div className="flex w-full flex-wrap justify-start gap-2 md:w-auto md:justify-end">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-[130px] rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <Skeleton className="min-h-[500px] w-full" />
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-20">
          <Card>
            <CardContent className="p-4 md:p-6">
              <Skeleton className="mb-4 h-6 w-40" />
              <Separator className="mb-4" />
              <div className="flex flex-col gap-3 text-sm">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2"
                    >
                      <span className="flex items-center gap-1.5">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-20" />
                      </span>
                      <Skeleton className="h-4 w-28" />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const useUserSession = () => {
  return useQuery({
    queryKey: ["userSession"],
    queryFn: async () => {
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        throw new Error("Không thể lấy thông tin người dùng.");
      }
      return response.json();
    },
  });
};

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  const queryClient = useQueryClient();

  const [selectedRating, setSelectedRating] = useState<number>(0);
  const [currentRating, setCurrentRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);

  const {
    data: documentDataArray,
    isLoading,
    error,
    isError,
  } = useQuery<FetchedDocument[], Error>({
    queryKey: ["document", documentId],
    queryFn: () => fetchDocument(documentId),
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  const document = documentDataArray?.[0];

  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);


  const {
    data: user,
    isLoading: userLoading,
    isError: userError,
  } = useUserSession();

  if (userLoading) return <p>Đang tải thông tin người dùng...</p>;
  if (userError) return <p>Không thể lấy thông tin người dùng.</p>;

  console.log("User session:", user);

  const handleReviewSubmit = useMutation({
    mutationFn: async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!user) {
        toast.error("Không thể gửi đánh giá. Người dùng chưa đăng nhập.");
        return;
      }

      const form = event.target as HTMLFormElement;
      const formData = new FormData(form);
      const rating = currentRating;
      const comment = formData.get("comment")?.toString() || "";

      if (!rating && !comment) {
        toast.error("Vui lòng nhập đánh giá hoặc bình luận.");
        return;
      }

      const newReview = {
        userId: user.user.id || "",
        userName: user.user.name || "",
        userImage: user.user.image || "",
        rating,
        comment,
      };

      if (editingReviewId) {
        // Gọi API để cập nhật đánh giá
        await fetch(`/api/documents/${documentId}/review/${editingReviewId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReview),
        });
        toast.success("Cập nhật đánh giá thành công!");
      } else {
        // Gọi API để thêm đánh giá mới
        await fetch(`/api/documents/${documentId}/review`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newReview),
        });
        toast.success("Gửi đánh giá thành công!");
      }

      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
      setComment(""); // Reset comment
      setCurrentRating(0); // Reset rating
      setEditingReviewId(null); // Reset trạng thái chỉnh sửa
    },
  });

  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchReviews = async () => {
      if (isFetchingMore) return; // Nếu đang tải thêm thì không làm gì cả
      setIsFetchingMore(true);
      try {
        const response = await fetch(
          `/api/documents/${documentId}/review?page=${currentPage}&limit=2`
        );
        if (!response.ok) {
          throw new Error("Không thể tải danh sách đánh giá.");
        }
        const data = await response.json();
        setReviews((prev) => [...prev, ...data.reviews]);
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi tải đánh giá.");
      } finally {
        setIsFetchingMore(false);
      }
    };

    fetchReviews();
  }, [currentPage, documentId]);

  useEffect(() => {
    if (isError && error) {
      toast.error(
        (error as Error).message || "Không thể lấy thông tin tài liệu"
      );
    }
    if (
      !isLoading &&
      !isError &&
      documentDataArray &&
      documentDataArray.length === 0
    ) {
      console.warn("Document fetch returned an empty array.");
    }
  }, [isError, error, isLoading, documentDataArray]);

  if (isLoading) {
    return <DocumentDetailSkeleton />;
  }

  if (isError || !document) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6">
        <FileIcon className="text-muted-foreground mb-4 h-16 w-16" />
        <h1 className="text-2xl font-bold">Không tìm thấy tài liệu</h1>
        <p className="text-muted-foreground mt-2 text-center">
          {typeof error === "object" && error !== null && "message" in error
            ? `Lỗi: ${(error as Error).message}`
            : "Tài liệu bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."}
        </p>
        <Button onClick={handleGoBack} variant="outline" className="mt-6">
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      </div>
    );
  }

  const handleEditReview = (review: any) => {
    setComment(review.comment || ""); // Đặt nội dung vào textarea
    setCurrentRating(review.rating || 0); // Đặt rating
    setEditingReviewId(review.id); // Lưu ID của đánh giá đang chỉnh sửa
  };

  const handleDeleteReview = async (review: any) => {
    if (confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      try {
        await fetch(`/api/documents/${documentId}/review/${review.id}`, {
          method: "DELETE",
        });
        toast.success("Xóa đánh giá thành công!");
        queryClient.invalidateQueries({ queryKey: ["document", documentId] });
      } catch (error) {
        toast.error("Đã xảy ra lỗi khi xóa đánh giá.");
      }
    }
  };

  const handleSaveEdit = async (reviewId: string) => {
    if (!currentRating && !comment) {
      toast.error("Vui lòng nhập đánh giá hoặc bình luận.");
      return;
    }

    try {
      await fetch(`/api/documents/${documentId}/review/${reviewId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rating: currentRating,
          comment,
        }),
      });
      toast.success("Cập nhật đánh giá thành công!");
      queryClient.invalidateQueries({ queryKey: ["document", documentId] });
      setEditingReviewId(null); // Đặt lại trạng thái chỉnh sửa
      setComment(""); // Reset comment
      setCurrentRating(0); // Reset rating
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật đánh giá.");
    }
  };

  return (
    <div className="container mx-auto flex max-w-6xl flex-col gap-6 p-4 md:p-6">
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={handleGoBack}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
          <div className="min-w-0">
            <h1
              className="truncate text-xl font-bold md:text-2xl"
              title={document.title}
            >
              {document.title}
            </h1>
            {document.category && (
              <p className="text-muted-foreground text-sm">
                {document.category.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex w-full flex-wrap justify-start gap-2 md:w-auto md:justify-end">
          <Button variant="outline" size="sm" asChild>
            <a
              href={document.fileUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className={
                !document.fileUrl ? "cursor-not-allowed opacity-50" : ""
              }
            >
              <EyeIcon className="mr-2 h-4 w-4" />
              Xem
            </a>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a
              href={document.fileUrl || "#"}
              download={document.originalFilename}
              className={
                !document.fileUrl ? "cursor-not-allowed opacity-50" : ""
              }
            >
              <DownloadIcon className="mr-2 h-4 w-4" />
              Tải xuống ({formatFileSize(document.fileSize)})
            </a>
          </Button>
          <Button variant="outline" size="sm">
            {/* ! TODO: implement share */}
            <ShareIcon className="mr-2 h-4 w-4" />
            Chia sẻ
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9">
            {/* ! TODO: implement bookmark */}
            <BookmarkIcon className="h-4 w-4" />
            <span className="sr-only">Bookmark</span>
          </Button>
        </div>
      </div>

      {/* Document details */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden p-5">
            <CardContent className="min-h-[500px] p-0">
              {document.fileUrl ? (
                <DocumentViewer
                  fileUrl={document.fileUrl}
                  fileType={document.fileType}
                  title={document.title}
                  thumbnailUrl={document.thumbnailUrl}
                />
              ) : (
                <div className="bg-muted/50 flex h-full min-h-[500px] items-center justify-center">
                  <p className="text-muted-foreground">
                    Preview không khả dụng.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:sticky lg:top-20">
          <Card>
            <CardContent className="p-4 md:p-6">
              <h3 className="mb-4 text-lg font-medium">Thông tin tài liệu</h3>
              <Separator className="mb-4" />
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <UserIcon className="h-4 w-4" /> Tác giả:
                  </span>
                  <span className="text-right font-medium">
                    {document.author?.name || "Không xác định"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <CalendarIcon className="h-4 w-4" /> Ngày tải lên:
                  </span>
                  <span className="text-right">
                    {new Date(document.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <FileIcon className="h-4 w-4" /> Loại file:
                  </span>
                  <span className="text-right">
                    {getDisplayExtension(document.fileType)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <FileIcon className="h-4 w-4" /> Kích thước:
                  </span>
                  <span className="text-right">
                    {formatFileSize(document.fileSize)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <DownloadIcon className="h-4 w-4" /> Lượt tải:
                  </span>
                  <span className="text-right">
                    {document.downloadCount ?? 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-4 md:p-6">
              <h3 className="mb-4 text-lg font-medium">Đánh giá & Bình luận</h3>
              <Separator className="mb-4" />

              {/* Form gửi đánh giá và bình luận */}
              <form
                onSubmit={(event) => {
                  handleReviewSubmit.mutate(event);
                }}
              >
                <div className="mb-4">
                  <p className="text-muted-foreground mb-2 text-sm">
                    Đánh giá tài liệu:
                  </p>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <label key={i}>
                        <input
                          type="radio"
                          name="rating"
                          value={i + 1}
                          className="hidden"
                        />
                        <StarIcon
                          className={`h-5 w-5 cursor-pointer transition-transform duration-200 ${
                            i < selectedRating
                              ? "scale-110 text-yellow-500"
                              : "text-muted-foreground"
                          }`}
                          onMouseEnter={() => setSelectedRating(i + 1)} // Highlight khi hover
                          onMouseLeave={() => setSelectedRating(currentRating)} // Reset khi rời chuột
                          onClick={() => setCurrentRating(i + 1)} // Cập nhật rating khi click
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <textarea
                  name="comment"
                  rows={3}
                  className="w-full rounded-md border p-2 text-sm"
                  placeholder="Nhập bình luận của bạn..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button type="submit" className=" mt-2" size="sm">
                  Gửi đánh giá & bình luận
                </Button>
              </form>

              <Separator className="my-6" />

              <div>
                <div>
                  <div className="space-y-4">
                    {reviews?.length ? (
                      reviews.map(
                        (
                          review: {
                            id: string;
                            userId: string | null | undefined;
                            userName: string | null | undefined;
                            userImage: string | null | undefined;
                            rating: number | null | undefined;
                            comment: string | null | undefined;
                            createdAt: string | null | undefined;
                          },
                          index: Key | null | undefined
                        ) => (
                          <div key={index} className="border-b pb-4">
                            {editingReviewId === review.id ? (
                              // Hiển thị form sửa nếu đang chỉnh sửa
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  handleSaveEdit(review.id);
                                }}
                              >
                                <div className="mb-2">
                                  <p className="text-muted-foreground mb-2 text-sm">
                                    Sửa đánh giá:
                                  </p>
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: 5 }, (_, i) => (
                                      <label key={i}>
                                        <input
                                          type="radio"
                                          name="rating"
                                          value={i + 1}
                                          className="hidden"
                                          checked={currentRating === i + 1}
                                          onChange={() =>
                                            setCurrentRating(i + 1)
                                          }
                                        />
                                        <StarIcon
                                          className={`h-5 w-5 cursor-pointer transition-transform duration-200 ${
                                            i < currentRating
                                              ? "scale-110 text-yellow-500"
                                              : "text-muted-foreground"
                                          }`}
                                          onClick={() =>
                                            setCurrentRating(i + 1)
                                          }
                                        />
                                      </label>
                                    ))}
                                  </div>
                                </div>
                                <textarea
                                  name="comment"
                                  rows={3}
                                  className="w-full rounded-md border p-2 text-sm"
                                  placeholder="Nhập bình luận của bạn..."
                                  value={comment}
                                  onChange={(e) => setComment(e.target.value)}
                                />
                                <div className="mt-2 flex gap-2">
                                  <Button
                                    type="submit"
                                    variant="outline"
                                    size="sm"
                                  >
                                    Lưu
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setEditingReviewId(null)}
                                  >
                                    Hủy
                                  </Button>
                                </div>
                              </form>
                            ) : (
                              // Hiển thị nội dung đánh giá nếu không chỉnh sửa
                              <>
                                <p className="mt-2 flex items-center gap-2 text-sm font-medium">
                                  {review.userName ||
                                    "Người dùng không xác định"}
                                  {review.userImage && (
                                    <img
                                      src={review.userImage}
                                      alt="User Avatar"
                                      className="ml-2 h-6 w-6 rounded-full"
                                    />
                                  )}
                                </p>
                                <div className="mt-1.5 flex items-center gap-2">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <StarIcon
                                      key={i}
                                      className={`h-2 w-2 ${
                                        i < (review.rating ?? 0)
                                          ? "text-yellow-500"
                                          : "text-muted-foreground"
                                      }`}
                                    />
                                  ))}
                                  <p className="text-muted-foreground mt-0.5 text-sm">
                                    {review.createdAt &&
                                      new Date(
                                        review.createdAt
                                      ).toLocaleDateString("vi-VN")}
                                  </p>
                                </div>
                                <p className="text-muted-foreground mt-1 text-sm">
                                  {review.comment}
                                </p>

                                {/* Hiển thị nút "Sửa" và "Xóa" nếu là đánh giá của người dùng */}
                                {review.userId === user?.user?.id && (
                                  <div className="mt-2 flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditReview(review)}
                                    >
                                      Sửa
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => handleDeleteReview(review)}
                                    >
                                      Xóa
                                    </Button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-muted-foreground text-sm italic">
                        Chưa có đánh giá hoặc bình luận nào.
                      </p>
                    )}
                  </div>
                </div>
                {/* Nút "Xem thêm" */}
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Xem thêm
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
