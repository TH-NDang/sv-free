import { auth } from "@/lib/auth";
import { getAllDocuments } from "@/lib/db/new_queries";
import { createDocument } from "@/lib/db/queries";
import { documentSchema } from "@/lib/db/schema";
import { getPublicUrl } from "@/lib/supabase/utils";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
    const responseData = {
      ...result,
      fileUrl: await getPublicUrl(result.storagePath, "documents"),
      thumbnailUrl: result.thumbnailStoragePath
        ? await getPublicUrl(result.thumbnailStoragePath, "thumbnails")
        : null,
    };

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

    // Lấy các tham số từ query string
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
