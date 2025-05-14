import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { documents, savedDocuments } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user?.id;
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get total uploads
    const uploadsResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(documents)
      .where(eq(documents.authorId, userId));

    // Get total downloads
    const downloadsResult = await db
      .select({ total: sql<number>`sum(${documents.downloadCount})` })
      .from(documents)
      .where(eq(documents.authorId, userId));

    // Get total saved documents
    const savedResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(savedDocuments)
      .where(eq(savedDocuments.userId, userId));

    return NextResponse.json({
      uploads: Number(uploadsResult[0]?.count || 0),
      downloads: Number(downloadsResult[0]?.total || 0),
      savedDocuments: Number(savedResult[0]?.count || 0),
    });
  } catch (error) {
    console.error("[USER_STATS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
