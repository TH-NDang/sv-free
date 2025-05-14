import { auth } from "@/lib/auth";
import { getAllDocuments } from "@/lib/db/new_queries";
import { createDocument, getDocuments } from "@/lib/db/queries";
import { documentSchema } from "@/lib/db/schema";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getPublicUrl } from "@/lib/supabase/utils";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json(
        { error: "You need to be logged in" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validationResult = documentSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Validation error:", validationResult.error.format());
      return NextResponse.json(
        {
          error: "Invalid document data",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validated = validationResult.data;

    const documentData = {
      ...validated,
      authorId: session.user.id,
    };

    const result = await createDocument(documentData);

    // Construct full URLs before returning the response
    const responseData = await Promise.all([
      {
        ...result,
        fileUrl: await getPublicUrl(result.storagePath, "documents"),
        thumbnailUrl: await getPublicUrl(
          result.thumbnailStoragePath,
          "thumbnails"
        ),
      },
    ]);

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error creating document:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Cannot create document", message: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const myUploads = searchParams.get("myUploads") === "true";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const searchQuery = searchParams.get("search") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const sortBy =
      (searchParams.get("sortBy") as
        | "title"
        | "createdAt"
        | "downloadCount"
        | "viewCount") || "createdAt";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "desc";
    const published = searchParams.get("published") === "false" ? false : true;

    if (myUploads) {
      // Get the current user session
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session) {
        return NextResponse.json(
          { error: "You need to be logged in" },
          { status: 401 }
        );
      }
      const authorId = session.user.id;

      const results = await getDocuments({
        categoryId,
        authorId,
      });
      // // Construct full URLs for each document
      const resultsWithUrls = await Promise.all(
        results.map(async (doc) => ({
          ...doc,
          fileUrl: await getPublicUrl(doc.storagePath, "documents"),
          thumbnailUrl: await getPublicUrl(
            doc.thumbnailStoragePath,
            "thumbnails"
          ),
        }))
      );

      return NextResponse.json(resultsWithUrls);
    }

    // Get session to check access rights
    // const session = await auth.api.getSession({
    //   headers: await headers(),
    // });
    // if (!session?.user) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Gọi hàm truy vấn documents
    const result = await getAllDocuments({
      page,
      pageSize,
      searchQuery,
      categoryId,
      sortBy,
      sortOrder,
      published,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
