import { getDocumentById } from "@/lib/db/queries";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = params.id;

    if (!documentId) {
      return NextResponse.json(
        { error: "ID tài liệu không hợp lệ" },
        { status: 400 }
      );
    }

    const document = await getDocumentById(documentId);

    if (!document) {
      return NextResponse.json(
        { error: "Không tìm thấy tài liệu" },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Lỗi khi lấy chi tiết tài liệu:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Lỗi không xác định";
    return NextResponse.json(
      { error: "Không thể lấy chi tiết tài liệu", message: errorMessage },
      { status: 500 }
    );
  }
}
