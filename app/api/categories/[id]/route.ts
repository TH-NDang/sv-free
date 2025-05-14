import { auth } from "@/lib/auth";
import {
  deleteCategory,
  getCategoryById,
  isCategoryNameExists,
  isCategorySlugExists,
  updateCategory,
} from "@/lib/db/new_queries";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const categorySchema = z.object({
  name: z
    .string()
    .min(2, "Tên danh mục phải có ít nhất 2 ký tự")
    .max(100, "Tên danh mục không được vượt quá 100 ký tự"),
  slug: z
    .string()
    .min(2, "Slug phải có ít nhất 2 ký tự")
    .max(100, "Slug không được vượt quá 100 ký tự"),
  description: z.string().optional(),
});

// GET /api/categories/[id] - Get category by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const category = await getCategoryById((await params).id);
    if (!category) {
      return NextResponse.json(
        { error: "Không tìm thấy danh mục" },
        { status: 404 }
      );
    }
    return NextResponse.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

//   // GET /api/categories/slug/[slug] - Get category by slug
//   export async function GET_BY_SLUG(
//     request: NextRequest,
//     { params }: { params: { slug: string } }
//   ) {
//     try {
//       const category = await getCategoryBySlug(params.slug);
//       if (!category) {
//         return NextResponse.json(
//           { error: "Không tìm thấy danh mục" },
//           { status: 404 }
//         );
//       }
//       return NextResponse.json(category);
//     } catch (error) {
//       console.error("Error fetching category:", error);
//       return NextResponse.json(
//         { error: "Failed to fetch category" },
//         { status: 500 }
//       );
//     }
//   }

// PATCH /api/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để cập nhật danh mục" },
        { status: 401 }
      );
    }
    const body = await request.json();
    const validationResult = categorySchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Dữ liệu danh mục không hợp lệ",
          details: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    // Check if name or slug already exists when updating
    if (validationResult.data.name) {
      const nameExists = await isCategoryNameExists(validationResult.data.name);
      if (nameExists) {
        return NextResponse.json(
          { error: "Tên danh mục đã tồn tại" },
          { status: 400 }
        );
      }
    }

    if (validationResult.data.slug) {
      const slugExists = await isCategorySlugExists(validationResult.data.slug);
      if (slugExists) {
        return NextResponse.json(
          { error: "Slug danh mục đã tồn tại" },
          { status: 400 }
        );
      }
    }

    const updatedCategory = await updateCategory((await params).id, {
      name: validationResult.data.name,
      slug: validationResult.data.slug,
      description: validationResult.data.description,
    });

    if (!updatedCategory) {
      return NextResponse.json(
        { error: "Không tìm thấy danh mục" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để xóa danh mục" },
        { status: 401 }
      );
    }

    const deletedCategory = await deleteCategory((await params).id);
    if (!deletedCategory) {
      return NextResponse.json(
        { error: "Không tìm thấy danh mục" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Danh mục đã được xóa thành công" });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
