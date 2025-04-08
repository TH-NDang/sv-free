import { getDocumentById } from "@/lib/db/queries";
import { getPublicUrl } from "@/lib/supabase/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const documentId = (await params).id;
    if (!documentId) {
      return NextResponse.json(
        { error: "Invalid document ID" },
        { status: 400 }
      );
    }

    const document = await getDocumentById(documentId);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Construct full URLs before returning the response
    const responseData = await Promise.all([
      {
        ...document,
        fileUrl: await getPublicUrl(document.storagePath, "documents"),
        thumbnailUrl: await getPublicUrl(
          document.thumbnailStoragePath,
          "thumbnails"
        ),
      },
    ]);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching document details:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Cannot fetch document details", message: errorMessage },
      { status: 500 }
    );
  }
}
