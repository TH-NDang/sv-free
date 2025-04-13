import { NextResponse } from "next/server";
import {
  getCategoryData,
  getDocumentStats,
  getFileTypeData,
  getTopDocuments,
  getUsers,
  getPendingDocumentsCount,
  getTotalStats,
} from "@/lib/db/new_queries";

export async function GET() {
  try {
    // Lấy dữ liệu từ các hàm trong `new_queries.ts`
    const categoryData = await getCategoryData();
    const monthlyStats = await getDocumentStats();
    const fileTypeData = await getFileTypeData();
    const topDocuments = await getTopDocuments();
    const users = await getUsers();
    const pendingDocuments = await getPendingDocumentsCount();
    const totalStats = await getTotalStats();

    // Trả về dữ liệu dưới dạng JSON
    return NextResponse.json({
      categoryData,
      monthlyStats,
      fileTypeData,
      topDocuments,
      users,
      pendingDocuments,
      totalDownloads: totalStats.totalDownloads,
      totalViews: totalStats.totalViews,
    });
  } catch (error) {
    console.error("Error fetching analytics data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}