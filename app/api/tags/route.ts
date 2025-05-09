import {
  createTag,
  getAllTags,
  isTagNameExists,
  isTagSlugExists,
} from "@/lib/db/new_queries";
import { NextResponse } from "next/server";

// GET /api/tags - Get all tags with pagination
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const sortBy =
      (searchParams.get("sortBy") as "name" | "createdAt") || "name";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "asc";
    const searchQuery = searchParams.get("searchQuery") || "";

    const tags = await getAllTags({
      page,
      pageSize,
      sortBy,
      sortOrder,
      searchQuery,
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

// POST /api/tags - Create a new tag
export async function POST(request: Request) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await request.json();
    const { name, slug } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: "Name and slug are required" },
        { status: 400 }
      );
    }

    // Check if tag name or slug already exists
    const [nameExists, slugExists] = await Promise.all([
      isTagNameExists(name),
      isTagSlugExists(slug),
    ]);

    if (nameExists) {
      return NextResponse.json(
        { error: "Tag name already exists" },
        { status: 400 }
      );
    }

    if (slugExists) {
      return NextResponse.json(
        { error: "Tag slug already exists" },
        { status: 400 }
      );
    }

    const newTag = await createTag({ name, slug });
    return NextResponse.json(newTag, { status: 201 });
  } catch (error) {
    console.error("Error creating tag:", error);
    return NextResponse.json(
      { error: "Failed to create tag" },
      { status: 500 }
    );
  }
}
