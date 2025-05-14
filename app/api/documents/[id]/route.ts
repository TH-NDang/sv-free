import { getDocumentById } from "@/lib/db/queries";
import { getPublicUrl } from "@/lib/supabase/utils";
import { auth } from "@/lib/auth";
import { Session } from "better-auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: documentId } = await params;
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
    console.error("Error fetching document:", error);
    return NextResponse.json(
      { error: "Failed to fetch document" },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] - Cập nhật document
export async function PUT(request: NextRequest) {
  try {
    // const session = (await auth.api.getSession({
    //   headers: await headers(),
    // })) as Session | null;
    // if (!session?.userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const formData = await request.formData();
    const data = JSON.parse(formData.get("data") as string);
    const file = formData.get("file") as File | null;

    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 });
    }
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // TODO: Implement document update logic
    return NextResponse.json({ message: "Document updated successfully" });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json(
      { error: "Failed to update document" },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Xóa document
export async function DELETE() {
  try {
    const session = (await auth.api.getSession({
      headers: await headers(),
    })) as Session | null;
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Implement document deletion logic
    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { error: "Failed to delete document" },
      { status: 500 }
    );
  }
}
