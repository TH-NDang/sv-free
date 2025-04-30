import { getReviewsByDocumentId,addReview, getTotalReviewsByDocumentId , updateReviewById, deleteReviewById} from "@/lib/db/new_queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id: documentId } = await context.params;

    if (!documentId) {
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    const reviews = await getReviewsByDocumentId(documentId, { page, limit });
    const totalReviews = await getTotalReviewsByDocumentId(documentId); // Hàm để lấy tổng số đánh giá

    return NextResponse.json({
      reviews,
      totalReviews,
      currentPage: page,
      totalPages: Math.ceil(Number(totalReviews) / limit),
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Cannot fetch reviews", message: errorMessage },
      { status: 500 }
    );
  }
}
  
export async function POST(
    request: NextRequest,
    context: { params: { id: string } }
  ) {
    try {
      const { id: documentId } = await context.params;
  
      if (!documentId) {
        return NextResponse.json(
          { error: "Invalid document ID" },
          { status: 400 }
        );
      }
  
      const body = await request.json();
      const { userId, rating, comment } = body;
  
      if (!userId || !rating) {
        return NextResponse.json(
          { error: "Missing required fields: userId or rating" },
          { status: 400 }
        );
      }
  
      const newReview = await addReview({
        documentId,
          userId : body.userId,
          userName: body.userName,
        userImage: body.userImage,
        rating,
        comment,
      });
  
      return NextResponse.json(newReview, { status: 201 });
    } catch (error) {
      console.error("Error adding review:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return NextResponse.json(
        { error: "Cannot add review", message: errorMessage },
        { status: 500 }
      );
    }
}
  