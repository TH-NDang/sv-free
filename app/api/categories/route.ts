import { auth } from "@/lib/auth";
import {
  createCategory,
  getAllCategories,
  isCategoryNameExists,
  isCategorySlugExists,
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

// GET /api/categories - Get all categories with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const sortBy =
      (searchParams.get("sortBy") as "name" | "createdAt") || "name";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "asc";
    const searchQuery = searchParams.get("searchQuery") || "";

    const categories = await getAllCategories({
      page,
      pageSize,
      sortBy,
      sortOrder,
      searchQuery,
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json(
        { error: "Bạn cần đăng nhập để tạo danh mục" },
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

    // Check if name or slug already exists
    const [nameExists, slugExists] = await Promise.all([
      isCategoryNameExists(validationResult.data.name),
      isCategorySlugExists(validationResult.data.slug),
    ]);

    if (nameExists) {
      return NextResponse.json(
        { error: "Tên danh mục đã tồn tại" },
        { status: 400 }
      );
    }

    if (slugExists) {
      return NextResponse.json(
        { error: "Slug danh mục đã tồn tại" },
        { status: 400 }
      );
    }

    const result = await createCategory({
      name: validationResult.data.name,
      slug: validationResult.data.slug,
      description: validationResult.data.description,
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Lỗi không xác định";

    return NextResponse.json(
      { error: "Không thể tạo danh mục", message: errorMessage },
      { status: 500 }
    );
  }
}
