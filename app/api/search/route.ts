import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import type { DocumentQueryParams } from "@/lib/db/queries";
import { getDocuments } from "@/lib/db/queries";
import { createClient } from "@/lib/supabase/server";

// Validation schema for query parameters
const searchParamsSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  date: z
    .enum(["today", "week", "month", "year", "all"])
    .optional()
    .default("all"),
  sort: z
    .enum(["relevance", "date", "popular", "az", "za"])
    .optional()
    .default("relevance"),
  limit: z.coerce.number().int().min(1).optional().default(20), // Default limit
  offset: z.coerce.number().int().min(0).optional().default(0),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const supabase = await createClient();

    // Validate search parameters
    const validationResult = searchParamsSchema.safeParse(
      Object.fromEntries(searchParams)
    );

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid search parameters",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { q, category, type, date, sort, limit, offset } =
      validationResult.data;

    // Map validated params to DocumentQueryParams
    const queryParams: DocumentQueryParams = {
      searchTerm: q,
      categoryId: category === "all" ? undefined : category,
      fileType: type === "all" ? undefined : type,
      dateRange: date,
      sortBy: sort,
      limit,
      offset,
    };

    // Fetch documents using the updated query function
    const documentsData = await getDocuments(queryParams);

    // Generate public URLs for storage paths
    const documentsWithUrls = documentsData.map((doc) => {
      let fileUrl: string | null = null;
      let thumbnailUrl: string | null = null;

      if (doc.storagePath) {
        fileUrl = supabase.storage
          .from("documents")
          .getPublicUrl(doc.storagePath).data.publicUrl;
      }
      if (doc.thumbnailStoragePath) {
        thumbnailUrl = supabase.storage
          .from("thumbnails")
          .getPublicUrl(doc.thumbnailStoragePath).data.publicUrl;
      }

      return {
        ...doc,
        fileUrl,
        thumbnailUrl,
      };
    });

    // Optionally, fetch total count for pagination if needed
    // const totalCount = await getDocumentsCount(queryParams); // (Requires a separate count function)

    return NextResponse.json({
      documents: documentsWithUrls, // Return documents with URLs
      // totalCount, // Include if implementing pagination fully
    });
  } catch (error) {
    console.error("Error fetching search results:", error);
    return NextResponse.json(
      { error: "Internal server error while searching documents" },
      { status: 500 }
    );
  }
}
