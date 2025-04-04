import { createDocument } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
// import { auth } from "@/lib/auth";

// Schema validation - Điều chỉnh categoryId để chấp nhận chuỗi
const documentSchema = z.object({
  title: z
    .string()
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự"),
  description: z.string().optional().nullable(),
  fileUrl: z.string().url("URL file không hợp lệ"),
  fileType: z.string().optional().nullable(),
  fileSize: z.string().optional().nullable(),
  categoryId: z
    .string()
    .optional()
    .nullable()
    .transform((val) => {
      // Check if it's a valid UUID
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!val || uuidRegex.test(val)) {
        return val;
      }
      // If it's not a valid UUID (like "programming"), return null
      console.log(`Converting non-UUID categoryId "${val}" to null`);
      return null;
    }),
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
    // Authentication (comment lại theo yêu cầu)
    // const session = await auth();
    // if (!session) {
    //   return NextResponse.json({ error: "Bạn cần đăng nhập" }, { status: 401 });
    // }

    const body = await request.json();

    // Log dữ liệu nhận được để debug
    console.log("Document data:", body);

    // Validate dữ liệu
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

    // Thêm ID tác giả từ session (đã comment lại theo yêu cầu)
    // const documentData = {
    //   ...validated,
    //   authorId: session.user.id,
    // };

    // Tạo tài liệu trong database
    const result = await createDocument(validated);

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
