import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { documents, savedDocuments } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;

    // Get saved documents with their details
    const savedDocs = await db
      .select({
        id: documents.id,
        title: documents.title,
        description: documents.description,
        originalFilename: documents.originalFilename,
        storagePath: documents.storagePath,
        fileType: documents.fileType,
        fileSize: documents.fileSize,
        thumbnailStoragePath: documents.thumbnailStoragePath,
        categoryId: documents.categoryId,
        authorId: documents.authorId,
        published: documents.published,
        downloadCount: documents.downloadCount,
        viewCount: documents.viewCount,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        category: documents.category,
        author: documents.author,
      })
      .from(savedDocuments)
      .innerJoin(documents, eq(savedDocuments.documentId, documents.id))
      .where(eq(savedDocuments.userId, userId));

    // Add file URLs
    const documentsWithUrls = savedDocs.map((doc) => ({
      ...doc,
      fileUrl: doc.storagePath ? `/api/documents/${doc.id}/file` : null,
      thumbnailUrl: doc.thumbnailStoragePath
        ? `/api/documents/${doc.id}/thumbnail`
        : null,
    }));

    return NextResponse.json(documentsWithUrls);
  } catch (error) {
    console.error("[SAVED_DOCUMENTS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
