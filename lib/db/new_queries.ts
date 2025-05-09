import { db, getDb } from "@/lib/db";
import { categories, documents, reviews, tags, user } from "@/lib/db/schema";
import { safeParseInt } from "@/lib/utils/parse";
import crypto from "crypto";
import { asc, desc, eq, gte, ilike, or, sql } from "drizzle-orm";
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
  const db = await getDb();
  const [result] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(user);
  return Number(result.count);
}

// Người dùng mới trong 7 ngày qua
export async function getNewUsers() {
  const db = await getDb();
  const [result] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(user)
    .where(gte(user.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)));
  return Number(result.count);
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

// Lấy danh sách đánh giá theo tài liệu
export async function getReviewsByDocumentId(
  documentId: string,
  options: { page: number; limit: number }
) {
  const db = await getDb();
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
  const db = await getDb();
  return db
    .select({ count: sql`COUNT(*)` })
    .from(reviews)
    .where(eq(reviews.documentId, documentId))
    .then((result) => result[0]?.count || 0);
}

// Thêm đánh giá
export async function addReview(data: {
  documentId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment?: string;
}) {
  const db = await getDb();
  const [insertedReview] = await db
    .insert(reviews)
    .values({
      ...data, // Spread operator để thêm tất cả các trường từ data
      id: sql`gen_random_uuid()`, // Generate a UUID for the id field
    })
    .returning();

  return insertedReview;
}

// Cập nhật đánh giá
export async function updateReviewById(
  reviewId: string,
  data: {
    rating?: number;
    comment?: string;
  }
) {
  const db = await getDb();
  const [updatedReview] = await db
    .update(reviews)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(reviews.id, reviewId))
    .returning();

  if (!updatedReview) {
    throw new Error("Review not found");
  }

  return updatedReview;
}

// Xóa đánh giá
export async function deleteReviewById(reviewId: string) {
  const db = await getDb();
  const [deletedReview] = await db
    .delete(reviews)
    .where(eq(reviews.id, reviewId))
    .returning();

  if (!deletedReview) {
    throw new Error("Review not found");
  }

  return deletedReview;
}

// Interface cho kết quả phân trang
interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

//truy vấn liên quan đến user
// Lấy tất cả users
// Lấy tất cả users với phân trang
export async function getAllUsers({
  page = 1,
  pageSize = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
}: {
  page?: number;
  pageSize?: number;
  sortBy?: "name" | "email" | "role" | "createdAt";
  sortOrder?: "asc" | "desc";
}): Promise<PaginatedResult<typeof user.$inferSelect>> {
  const db = await getDb();
  // Tính toán offset
  const offset = (page - 1) * pageSize;

  // Xác định cột sắp xếp
  const sortColumn =
    {
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }[sortBy] || user.createdAt;

  // Thực hiện query với phân trang và sắp xếp
  const [users, total] = await Promise.all([
    db
      .select()
      .from(user)
      .orderBy(sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn))
      .limit(pageSize)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(user),
  ]);

  const totalCount = Number(total[0].count);
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: users,
    page,
    pageSize,
    total: totalCount,
    totalPages,
  };
}

// Lấy user theo ID
export async function getUserById(id: string) {
  const db = await getDb();
  const [userData] = await db.select().from(user).where(eq(user.id, id));
  return userData;
}

// Tạo user mới
export async function createUser(data: {
  name: string;
  email: string;
  role?: string;
  banned?: boolean;
  banReason?: string;
  banExpires?: Date;
}) {
  const db = await getDb();
  const [newUser] = await db
    .insert(user)
    .values({
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      emailVerified: false,
      role: data.role || "User",
      banned: data.banned || false,
      banReason: data.banReason,
      banExpires: data.banExpires,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return newUser;
}

// Cập nhật user
export async function updateUser(
  id: string,
  data: {
    name?: string;
    email?: string;
    role?: string;
    banned?: boolean;
    banReason?: string;
    banExpires?: Date;
  }
) {
  const db = await getDb();
  const [updatedUser] = await db
    .update(user)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(user.id, id))
    .returning();

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
}

// Xóa user
export async function deleteUser(id: string) {
  const db = await getDb();
  const [deletedUser] = await db
    .delete(user)
    .where(eq(user.id, id))
    .returning();

  if (!deletedUser) {
    throw new Error("User not found");
  }

  return deletedUser;
}

// Tìm kiếm users theo tên
export async function searchUsers(query: string) {
  const db = await getDb();
  return await db
    .select()
    .from(user)
    .where(or(ilike(user.name, `%${query}%`), ilike(user.email, `%${query}%`)))
    .orderBy(asc(user.name));
}

// Ban user
export async function banUser(id: string, reason: string, expiresAt?: Date) {
  const [bannedUser] = await db
    .update(user)
    .set({
      banned: true,
      banReason: reason,
      banExpires: expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(user.id, id))
    .returning();
  return bannedUser;
}

// Unban user
export async function unbanUser(id: string) {
  const [unbannedUser] = await db
    .update(user)
    .set({
      banned: false,
      banReason: null,
      banExpires: null,
      updatedAt: new Date(),
    })
    .where(eq(user.id, id))
    .returning();
  return unbannedUser;
}

// Lấy danh sách users bị ban
export async function getBannedUsers() {
  return await db.select().from(user).where(eq(user.banned, true));
}

// Lấy danh sách users theo role
export async function getUsersByRole(role: string) {
  return await db.select().from(user).where(eq(user.role, role));
}

// Kiểm tra email đã tồn tại chưa
export async function isEmailExists(email: string) {
  const [existingUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email));
  return !!existingUser;
}

// Cập nhật role của user
export async function updateUserRole(id: string, role: string) {
  const [updatedUser] = await db
    .update(user)
    .set({
      role,
      updatedAt: new Date(),
    })
    .where(eq(user.id, id))
    .returning();
  return updatedUser;
}

// Lấy số lượng users theo role
export async function getUsersCountByRole() {
  return await db
    .select({
      role: user.role,
      count: sql<number>`count(*)`,
    })
    .from(user)
    .groupBy(user.role);
}

// Lấy số lượng users bị ban
export async function getBannedUsersCount() {
  const [result] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(user)
    .where(eq(user.banned, true));
  return Number(result.count);
}

// Lấy tất cả documents với phân trang
export async function getAllDocuments({
  page = 1,
  pageSize = 10,
  sortBy = "createdAt",
  sortOrder = "desc",
  searchQuery = "",
  categoryId = "",
  published = true,
}: {
  page?: number;
  pageSize?: number;
  sortBy?: "title" | "createdAt" | "downloadCount" | "viewCount";
  sortOrder?: "asc" | "desc";
  searchQuery?: string;
  categoryId?: string;
  published?: boolean;
}): Promise<PaginatedResult<typeof documents.$inferSelect>> {
  const db = await getDb();
  // Tính toán offset
  const offset = (page - 1) * pageSize;

  // Xác định cột sắp xếp
  const sortColumn =
    {
      title: documents.title,
      createdAt: documents.createdAt,
      downloadCount: documents.downloadCount,
      viewCount: documents.viewCount,
    }[sortBy] || documents.createdAt;

  // Tạo điều kiện tìm kiếm
  const conditions = [];
  if (searchQuery) {
    conditions.push(ilike(documents.title, `%${searchQuery}%`));
  }
  if (categoryId) {
    conditions.push(eq(documents.categoryId, categoryId));
  }
  if (published !== undefined) {
    conditions.push(eq(documents.published, published));
  }

  // Thực hiện query với phân trang và sắp xếp
  const [docs, total] = await Promise.all([
    db
      .select({
        id: documents.id,
        title: documents.title,
        description: documents.description,
        originalFilename: documents.originalFilename,
        storagePath: documents.storagePath,
        fileType: documents.fileType,
        fileSize: documents.fileSize,
        thumbnailStoragePath: documents.thumbnailStoragePath,
        categoryId: documents.categoryId,
        authorId: documents.authorId,
        published: documents.published,
        downloadCount: documents.downloadCount,
        viewCount: documents.viewCount,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        category: categories.name,
        author: user.name,
      })
      .from(documents)
      .leftJoin(categories, eq(documents.categoryId, categories.id))
      .leftJoin(user, eq(documents.authorId, user.id))
      .where(
        conditions.length > 0
          ? sql`${sql.join(conditions, sql` AND `)}`
          : undefined
      )
      .orderBy(sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(documents)
      .where(
        conditions.length > 0
          ? sql`${sql.join(conditions, sql` AND `)}`
          : undefined
      ),
  ]);

  const totalCount = Number(total[0].count);
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: docs,
    page,
    pageSize,
    total: totalCount,
    totalPages,
  };
}

// Lấy document theo ID
export async function getDocumentById(id: string) {
  const db = await getDb();
  const [document] = await db
    .select({
      id: documents.id,
      title: documents.title,
      description: documents.description,
      originalFilename: documents.originalFilename,
      storagePath: documents.storagePath,
      fileType: documents.fileType,
      fileSize: documents.fileSize,
      thumbnailStoragePath: documents.thumbnailStoragePath,
      categoryId: documents.categoryId,
      authorId: documents.authorId,
      published: documents.published,
      downloadCount: documents.downloadCount,
      viewCount: documents.viewCount,
      createdAt: documents.createdAt,
      updatedAt: documents.updatedAt,
      category: categories.name,
      author: user.name,
    })
    .from(documents)
    .leftJoin(categories, eq(documents.categoryId, categories.id))
    .leftJoin(user, eq(documents.authorId, user.id))
    .where(eq(documents.id, id));

  return document;
}

// Cập nhật document
export async function updateDocument(
  id: string,
  data: {
    title?: string;
    description?: string | null;
    originalFilename?: string;
    storagePath?: string;
    fileType?: string | null;
    fileSize?: number | null;
    thumbnailStoragePath?: string | null;
    categoryId?: string | null;
    published?: boolean;
  }
) {
  const db = await getDb();
  const [updatedDoc] = await db
    .update(documents)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(documents.id, id))
    .returning();

  if (!updatedDoc) {
    throw new Error("Document not found");
  }

  return updatedDoc;
}

// Xóa document
export async function deleteDocument(id: string) {
  const db = await getDb();
  const [deletedDoc] = await db
    .delete(documents)
    .where(eq(documents.id, id))
    .returning();

  if (!deletedDoc) {
    throw new Error("Document not found");
  }

  return deletedDoc;
}

// Category related queries
// Get all categories with pagination
export async function getAllCategories({
  page = 1,
  pageSize = 10,
  sortBy = "name",
  sortOrder = "asc",
  searchQuery = "",
}: {
  page?: number;
  pageSize?: number;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  searchQuery?: string;
}): Promise<
  PaginatedResult<typeof categories.$inferSelect & { documentCount: number }>
> {
  const db = await getDb();
  const offset = (page - 1) * pageSize;

  const sortColumn =
    {
      name: categories.name,
      createdAt: categories.createdAt,
    }[sortBy] || categories.name;

  const conditions = [];
  if (searchQuery) {
    conditions.push(ilike(categories.name, `%${searchQuery}%`));
  }

  const [cats, total] = await Promise.all([
    db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        documentCount: sql<number>`COUNT(${documents.id})`,
      })
      .from(categories)
      .leftJoin(documents, eq(categories.id, documents.categoryId))
      .where(
        conditions.length > 0
          ? sql`${sql.join(conditions, sql` AND `)}`
          : undefined
      )
      .groupBy(categories.id)
      .orderBy(sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(categories)
      .where(
        conditions.length > 0
          ? sql`${sql.join(conditions, sql` AND `)}`
          : undefined
      ),
  ]);

  const totalCount = Number(total[0].count);
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: cats,
    page,
    pageSize,
    total: totalCount,
    totalPages,
  };
}

// Get category by ID
export async function getCategoryById(id: string) {
  const db = await getDb();
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.id, id));
  return category;
}

// Get category by slug
export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug));
  return category;
}

// Create new category
export async function createCategory(data: {
  name: string;
  slug: string;
  description?: string;
}) {
  const db = await getDb();
  const [newCategory] = await db
    .insert(categories)
    .values({
      id: crypto.randomUUID(),
      name: data.name,
      slug: data.slug,
      description: data.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return newCategory;
}

// Update category
export async function updateCategory(
  id: string,
  data: {
    name?: string;
    slug?: string;
    description?: string;
  }
) {
  const db = await getDb();
  const [updatedCategory] = await db
    .update(categories)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(categories.id, id))
    .returning();

  if (!updatedCategory) {
    throw new Error("Category not found");
  }

  return updatedCategory;
}

// Delete category
export async function deleteCategory(id: string) {
  const db = await getDb();
  const [deletedCategory] = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning();

  if (!deletedCategory) {
    throw new Error("Category not found");
  }

  return deletedCategory;
}

// Check if category name exists
export async function isCategoryNameExists(name: string) {
  const db = await getDb();
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.name, name));
  return !!category;
}

// Check if category slug exists
export async function isCategorySlugExists(slug: string) {
  const db = await getDb();
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug));
  return !!category;
}

// Get total number of categories
export async function getTotalCategoriesCount() {
  const db = await getDb();
  const [result] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(categories);
  return Number(result.count);
}

// Get categories with document count
export async function getCategoriesWithDocumentCount() {
  const db = await getDb();
  return await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      documentCount: sql<number>`COUNT(${documents.id})`,
    })
    .from(categories)
    .leftJoin(documents, eq(categories.id, documents.categoryId))
    .groupBy(categories.id)
    .orderBy(asc(categories.name));
}

// Get all categories without pagination
export async function getAllCategoriesWithoutPagination() {
  const db = await getDb();
  const result = await db
    .select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      description: categories.description,
      createdAt: categories.createdAt,
      updatedAt: categories.updatedAt,
      documentCount: sql<number>`COUNT(${documents.id})`,
    })
    .from(categories)
    .leftJoin(documents, eq(categories.id, documents.categoryId))
    .groupBy(categories.id)
    .orderBy(asc(categories.name));

  return result;
}

// Tag related queries
// Get all tags with pagination
export async function getAllTags({
  page = 1,
  pageSize = 10,
  sortBy = "name",
  sortOrder = "asc",
  searchQuery = "",
}: {
  page?: number;
  pageSize?: number;
  sortBy?: "name" | "createdAt";
  sortOrder?: "asc" | "desc";
  searchQuery?: string;
}): Promise<PaginatedResult<typeof tags.$inferSelect>> {
  const db = await getDb();
  const offset = (page - 1) * pageSize;

  const sortColumn =
    {
      name: tags.name,
      createdAt: tags.createdAt,
    }[sortBy] || tags.name;

  const conditions = [];
  if (searchQuery) {
    conditions.push(ilike(tags.name, `%${searchQuery}%`));
  }

  const [tagList, total] = await Promise.all([
    db
      .select()
      .from(tags)
      .where(
        conditions.length > 0
          ? sql`${sql.join(conditions, sql` AND `)}`
          : undefined
      )
      .orderBy(sortOrder === "desc" ? desc(sortColumn) : asc(sortColumn))
      .limit(pageSize)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)` })
      .from(tags)
      .where(
        conditions.length > 0
          ? sql`${sql.join(conditions, sql` AND `)}`
          : undefined
      ),
  ]);

  const totalCount = Number(total[0].count);
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    data: tagList,
    page,
    pageSize,
    total: totalCount,
    totalPages,
  };
}

// Get tag by ID
export async function getTagById(id: string) {
  const db = await getDb();
  const [tag] = await db.select().from(tags).where(eq(tags.id, id));
  return tag;
}

// Get tag by slug
export async function getTagBySlug(slug: string) {
  const db = await getDb();
  const [tag] = await db.select().from(tags).where(eq(tags.slug, slug));
  return tag;
}

// Create new tag
export async function createTag(data: { name: string; slug: string }) {
  const db = await getDb();
  const [newTag] = await db
    .insert(tags)
    .values({
      id: crypto.randomUUID(),
      name: data.name,
      slug: data.slug,
      createdAt: new Date(),
    })
    .returning();
  return newTag;
}

// Update tag
export async function updateTag(
  id: string,
  data: {
    name?: string;
    slug?: string;
  }
) {
  const db = await getDb();
  const [updatedTag] = await db
    .update(tags)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(tags.id, id))
    .returning();

  if (!updatedTag) {
    throw new Error("Tag not found");
  }

  return updatedTag;
}

// Delete tag
export async function deleteTag(id: string) {
  const db = await getDb();
  const [deletedTag] = await db.delete(tags).where(eq(tags.id, id)).returning();

  if (!deletedTag) {
    throw new Error("Tag not found");
  }

  return deletedTag;
}

// Check if tag name exists
export async function isTagNameExists(name: string) {
  const db = await getDb();
  const [tag] = await db.select().from(tags).where(eq(tags.name, name));
  return !!tag;
}

// Check if tag slug exists
export async function isTagSlugExists(slug: string) {
  const db = await getDb();
  const [tag] = await db.select().from(tags).where(eq(tags.slug, slug));
  return !!tag;
}

// Get total number of tags
export async function getTotalTagsCount() {
  const db = await getDb();
  const [result] = await db
    .select({
      count: sql<number>`count(*)`,
    })
    .from(tags);
  return Number(result.count);
}

// Get all tags without pagination
export async function getAllTagsWithoutPagination() {
  const db = await getDb();
  return await db.select().from(tags).orderBy(asc(tags.name));
}

// Increment document view count
export async function incrementDocumentViewCount(documentId: string) {
  try {
    const [updatedDocument] = await db
      .update(documents)
      .set({
        viewCount: sql`${documents.viewCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(documents.id, documentId))
      .returning();
    return updatedDocument;
  } catch (error) {
    console.error("Error incrementing document view count:", error);
    throw new Error("Failed to increment document view count");
  }
}

// Create new document
export async function createDocument(data: {
  id: string;
  title: string;
  description?: string;
  originalFilename: string;
  storagePath: string;
  fileType?: string;
  fileSize?: number;
  thumbnailStoragePath?: string;
  categoryId: string;
  authorId: string;
}) {
  const db = await getDb();
  const [newDocument] = await db
    .insert(documents)
    .values({
      ...data,
      published: true,
      downloadCount: 0,
      viewCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning();
  return newDocument;
}
