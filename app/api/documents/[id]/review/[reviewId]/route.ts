import { NextRequest, NextResponse } from "next/server";
import { updateReviewById, deleteReviewById } from "@/lib/db/new_queries";

export async function PUT(
  request: NextRequest,
  context: { params: { id: string; reviewId: string } }
) {
  try {
    const { id: documentId, reviewId } = context.params;
    const body = await request.json();

    if (!documentId || !reviewId) {
      return NextResponse.json(
        { error: "Invalid document or review ID" },
        { status: 400 }
      );
    }

    const updatedReview = await updateReviewById(reviewId, {
      rating: body.rating,
      comment: body.comment,
    });

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: { id: string; reviewId: string } }
) {
  try {
    const { id: documentId, reviewId } = context.params;

    if (!documentId || !reviewId) {
      return NextResponse.json(
        { error: "Invalid document or review ID" },
        { status: 400 }
      );
    }

    const deletedReview = await deleteReviewById(reviewId);

    return NextResponse.json(deletedReview, { status: 200 });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
