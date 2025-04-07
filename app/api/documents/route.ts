import { createDocument } from "@/lib/db/queries";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { headers } from "next/headers";

const documentSchema = z.object({
  title: z
    .string()
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự"),
  description: z.string().optional().nullable(),
  fileUrl: z.string().url("URL file không hợp lệ"),
  fileType: z.string().optional().nullable(),
  fileSize: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  authorId: z.string().optional().nullable(),
  thumbnailUrl: z
    .string()
    .url("URL thumbnail không hợp lệ")
    .optional()
    .nullable(),
  published: z.boolean().optional().default(true),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "Bạn cần đăng nhập" }, { status: 401 });
    }

    const body = await request.json();
    const validationResult = documentSchema.safeParse(body);

    if (!validationResult.success) {
      console.error("Lỗi validation:", validationResult.error.format());
      return NextResponse.json(
        {
          error: "Dữ liệu tài liệu không hợp lệ",
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

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Lỗi khi tạo tài liệu:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Lỗi không xác định";
    return NextResponse.json(
      { error: "Không thể tạo tài liệu", message: errorMessage },
      { status: 500 }
    );
  }
}
