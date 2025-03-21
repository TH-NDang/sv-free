import { generateSampleDocuments } from "@/app/(main)/types/document";
import { NextRequest, NextResponse } from "next/server";

// This is a mock download handler
// In a real app, you would fetch the document from storage and stream it to the client
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Simulate fetching the document
    const documents = generateSampleDocuments(20);
    const document = documents.find((d) => d.id === params.id);

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // In a real app, you would:
    // 1. Get the document from your storage (S3, database, etc.)
    // 2. Set the appropriate headers (Content-Type, Content-Disposition, etc.)
    // 3. Stream the file to the client

    // For demo purposes, we'll just return some JSON
    return NextResponse.json({
      success: true,
      message: `Started download for: ${document.title}`,
      document: {
        id: document.id,
        title: document.title,
        fileType: document.fileType,
        fileSize: document.fileSize,
      },
    });
  } catch (error) {
    console.error("Error downloading document:", error);
    return NextResponse.json(
      { error: "Failed to download document" },
      { status: 500 }
    );
  }
}
