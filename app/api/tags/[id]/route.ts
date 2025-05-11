import {
  deleteTag,
  getTagById,
  isTagNameExists,
  isTagSlugExists,
  updateTag,
} from "@/lib/db/new_queries";
import { NextResponse } from "next/server";

// GET /api/tags/:id - Get a specific tag by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tag = await getTagById((await params).id);

    if (!tag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    return NextResponse.json(tag);
  } catch (error) {
    console.error("Error fetching tag:", error);
    return NextResponse.json({ error: "Failed to fetch tag" }, { status: 500 });
  }
}

// PATCH /api/tags/:id - Update a tag
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const body = await request.json();
    const { name, slug } = body;

    if (!name && !slug) {
      return NextResponse.json(
        { error: "At least one field (name or slug) is required" },
        { status: 400 }
      );
    }

    // Check if tag exists
    const existingTag = await getTagById((await params).id);
    if (!existingTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    // Check if new name or slug already exists
    if (name && name !== existingTag.name) {
      const nameExists = await isTagNameExists(name);
      if (nameExists) {
        return NextResponse.json(
          { error: "Tag name already exists" },
          { status: 400 }
        );
      }
    }

    if (slug && slug !== existingTag.slug) {
      const slugExists = await isTagSlugExists(slug);
      if (slugExists) {
        return NextResponse.json(
          { error: "Tag slug already exists" },
          { status: 400 }
        );
      }
    }

    const updatedTag = await updateTag((await params).id, { name, slug });
    return NextResponse.json(updatedTag);
  } catch (error) {
    console.error("Error updating tag:", error);
    return NextResponse.json(
      { error: "Failed to update tag" },
      { status: 500 }
    );
  }
}

// DELETE /api/tags/:id - Delete a tag
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if tag exists
    const existingTag = await getTagById((await params).id);
    if (!existingTag) {
      return NextResponse.json({ error: "Tag not found" }, { status: 404 });
    }

    await deleteTag((await params).id);
    return NextResponse.json(
      { message: "Tag deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting tag:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
