import { db } from "@/lib/db";
import { categories, documents, user, reviews } from "@/lib/db/schema";
import { safeParseInt } from "@/lib/utils/parse";
import { desc, eq, sql } from "drizzle-orm";
//  * @param data - Document data

// Lấy danh mục và số lượng tài liệu
export async function getCategoryData() {
  try {
    const result = await db
      .select({
        category: categories.name,
        documents: sql<number>`COUNT(${documents.id})`,
      })
      .from(categories)
      .leftJoin(documents, eq(categories.id, documents.categoryId))
      .groupBy(categories.name);

    const formattedResult = result.map((row) => ({
      category: row.category,
      documents: row.documents || 0, // Đảm bảo trả về 0 nếu không có tài liệu
    }));

    console.log("getCategoryData result:", formattedResult); // Kiểm tra kết quả trả về
    return formattedResult;
  } catch (error) {
    console.error("Error fetching category data:", error);
    throw new Error("Failed to fetch category data");
  }
}

// Lượt tải/xem theo tháng
export async function getDocumentStats() {
  const result = await db
    .select({
      createdAt: documents.createdAt,
      downloadCount: documents.downloadCount,
      viewCount: documents.viewCount,
    })
    .from(documents)
    .where(eq(documents.published, true));

  const monthlyStats = result.reduce<
    Record<string, { downloads: number; views: number }>
  >((acc, doc) => {
    const date = new Date(doc.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!acc[key]) acc[key] = { downloads: 0, views: 0 };
    acc[key].downloads += safeParseInt(doc.downloadCount);
    acc[key].views += safeParseInt(doc.viewCount);
    return acc;
  }, {});

  return Object.entries(monthlyStats).map(([month, stats]) => ({
    month,
    downloads: stats.downloads,
    views: stats.views,
  }));
}

// Phân bố loại file
export async function getFileTypeData() {
  const result = await db
    .select({ fileType: documents.fileType })
    .from(documents)
    .where(eq(documents.published, true));

  const fileTypeCounts = result.reduce<Record<string, number>>((acc, doc) => {
    const type = doc.fileType || "Other";
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return Object.keys(fileTypeCounts).map((type) => ({
    type,
    count: fileTypeCounts[type],
  }));
}

// Top tài liệu
export async function getTopDocuments() {
  const result = await db
    .select({
      id: documents.id,
      title: documents.title,
      category: categories.name,
      downloads: documents.downloadCount,
      views: documents.viewCount,
    })
    .from(documents)
    .leftJoin(categories, eq(documents.categoryId, categories.id))
    .where(eq(documents.published, true))
    .orderBy(desc(documents.downloadCount))
    .limit(10);

  return result.map((doc) => ({
    id: doc.id,
    title: doc.title,
    category: doc.category || "Không xác định",
    downloads: safeParseInt(doc.downloads),
    views: safeParseInt(doc.views),
  }));
}

// Người dùng + lượt tải
export async function getUsers() {
  const result = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.banned,
      createdAt: user.createdAt,
      uploads: sql<number>`COUNT(DISTINCT ${documents.id})`,
    })
    .from(user)
    .leftJoin(documents, eq(user.id, documents.authorId))
    .where(eq(user.banned, false))
    .groupBy(user.id);

  return result.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role || "student", // Đảm bảo role không null
    status: user.status ? "Banned" : "Active",
    createdAt: new Date(user.createdAt).toISOString().split("T")[0],
    uploads: user.uploads || 0,
  }));
}

// Người dùng mới trong 7 ngày qua
export async function getNewUsers() {
  try {
    // Tính toán ngày bắt đầu (7 ngày trước)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const result = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.banned,
        createdAt: user.createdAt,
        uploads: sql<number>`COUNT(DISTINCT ${documents.id})`,
      })
      .from(user)
      .leftJoin(documents, eq(user.id, documents.authorId))
      .where(
        sql`${user.createdAt} >= ${oneWeekAgo.toISOString()} AND ${user.banned} = FALSE`
      )
      .groupBy(user.id)
      .orderBy(desc(user.createdAt));

    return result.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role || "student", // Đảm bảo role không null
      status: user.status ? "Banned" : "Active",
      createdAt: new Date(user.createdAt).toISOString().split("T")[0],
      uploads: user.uploads || 0,
    }));
  } catch (error) {
    console.error("Error fetching new users:", error);
    throw new Error("Failed to fetch new users");
  }
}

// Số tài liệu chờ duyệt
export async function getPendingDocumentsCount() {
  const result = await db
    .select({ count: sql<number>`COUNT(${documents.id})` })
    .from(documents)
    .where(eq(documents.published, false));

  return result[0]?.count || 0;
}

// Tổng lượt tải & xem
export async function getTotalStats() {
  const result = await db
    .select({
      totalDownloads: sql<number>`SUM(${documents.downloadCount})`,
      totalViews: sql<number>`SUM(${documents.viewCount})`,
    })
    .from(documents)
    .where(eq(documents.published, true));

  return {
    totalDownloads: result[0]?.totalDownloads || 0,
    totalViews: result[0]?.totalViews || 0,
  };
}

//// Lấy danh sách đánh giá theo tài liệu
export async function getReviewsByDocumentId(
  documentId: string,
  options: { page: number; limit: number }
) {
  const { page, limit } = options;
  const offset = (page - 1) * limit;

  return db
    .select()
    .from(reviews)
    .where(eq(reviews.documentId, documentId))
    .orderBy(desc(reviews.createdAt)) // Sắp xếp giảm dần theo createdAt
    .offset(offset)
    .limit(limit);
}

export async function getTotalReviewsByDocumentId(documentId: string) {
  return db
    .select({ count: sql`COUNT(*)` })
    .from(reviews)
    .where(eq(reviews.documentId, documentId))
    .then((result) => result[0]?.count || 0);
}

//// Thêm đánh giá
export async function addReview(data: {
  documentId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment?: string;
}) {
  const [insertedReview] = await db
    .insert(reviews)
    .values({
      ...data, // Spread operator để thêm tất cả các trường từ data
      id: sql`gen_random_uuid()`, // Generate a UUID for the id field
    })
    .returning();

  return insertedReview;
}

export async function updateReviewById(
  reviewId: string,
  data: {
    rating?: number;
    comment?: string;
  }
) {
  const [updatedReview] = await db
    .update(reviews)
    .set(data)
    .where(eq(reviews.id, reviewId))
    .returning();

  return updatedReview;
}

export async function deleteReviewById(reviewId: string) {
  const [deletedReview] = await db
    .delete(reviews)
    .where(eq(reviews.id, reviewId))
    .returning();

  return deletedReview;
}
