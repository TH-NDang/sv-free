import { auth } from "@/lib/auth";
import { createCategory, getCategories } from "@/lib/db/queries";
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
  description: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

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

    const result = await createCategory(validationResult.data);

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
