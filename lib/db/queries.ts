import { db } from "@/lib/db";
import { categories, documents, NewDocument, user } from "@/lib/db/schema";
import { startOfDay, subDays, subMonths, subYears } from "date-fns";
import { and, asc, desc, eq, gte, ilike, like, or, SQL } from "drizzle-orm";

// ==========================================
// Document Types
// ==========================================

/**
 * Type for document query parameters
 */
export type DocumentQueryParams = {
  searchTerm?: string;
  categoryId?: string;
  authorId?: string;
  fileType?: string;
  dateRange?: "today" | "week" | "month" | "year" | "all";
  sortBy?: "relevance" | "date" | "popular" | "az" | "za";
  limit?: number;
  offset?: number;
};

export type DocumentWithDetails = typeof documents.$inferSelect & {
  category: typeof categories.$inferSelect | null;
  author: Pick<typeof user.$inferSelect, "id" | "name" | "image"> | null;
};

// ==========================================
// Category Types
// ==========================================

export type Category = typeof categories.$inferSelect;

export type CategoryWithDocuments = typeof categories.$inferSelect & {
  documents: (typeof documents.$inferSelect)[];
};

/**
 * Type for category creation
 */
export interface CreateCategoryData {
  name: string;
  slug: string;
  description?: string | null;
}

/**
 * Type for category update
 */
export interface UpdateCategoryData {
  name?: string;
  slug?: string;
  description?: string | null;
}

/**
 * Type for category query parameters
 */
export interface CategoryQueryParams {
  search?: string;
  page?: number;
  limit?: number;
}

// ==========================================
// Document Queries
// ==========================================

/**
 * Create a new document
 */
export async function createDocument(data: NewDocument) {
  try {
    const result = await db.insert(documents).values(data).returning();

    if (!result || result.length === 0) {
      throw new Error("Document không được tạo");
    }

    return result[0];
  } catch (error) {
    console.error("Error creating document:", error);
    throw new Error(
      `Không thể lưu document vào database: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Get documents with advanced filtering and sorting, including author details
 */
export async function getDocuments({
  searchTerm,
  categoryId,
  authorId,
  fileType,
  dateRange = "all",
  sortBy = "relevance",
  limit = 10,
  offset = 0,
}: DocumentQueryParams = {}): Promise<DocumentWithDetails[]> {
  try {
    // Build conditions for SQL using 'and'
    const conditions: (SQL | undefined)[] = [];

    if (searchTerm) {
      const searchCondition = or(
        ilike(documents.title, `%${searchTerm}%`),
        ilike(documents.description, `%${searchTerm}%`),
        ilike(user.name, `%${searchTerm}%`) // Assuming author name search
      );
      conditions.push(searchCondition);
    }

    if (categoryId) {
      conditions.push(eq(documents.categoryId, categoryId));
    }

    if (authorId) {
      conditions.push(eq(documents.authorId, authorId));
    }

    if (fileType) {
      conditions.push(eq(documents.fileType, fileType));
    }

    if (dateRange !== "all") {
      let startDate: Date;
      const now = new Date();

      switch (dateRange) {
        case "today":
          startDate = startOfDay(now);
          break;
        case "week":
          startDate = subDays(now, 7);
          break;
        case "month":
          startDate = subMonths(now, 1);
          break;
        case "year":
          startDate = subYears(now, 1);
          break;
      }
      conditions.push(gte(documents.createdAt, startDate));
    }

    const whereCondition =
      conditions.length > 0 ? and(...conditions) : undefined;

    // Determine sorting order
    let orderByClause: SQL | SQL[];
    switch (sortBy) {
      case "date":
        orderByClause = desc(documents.createdAt);
        break;
      case "popular":
        orderByClause = desc(documents.downloadCount);
        break;
      case "az":
        orderByClause = asc(documents.title);
        break;
      case "za":
        orderByClause = desc(documents.title);
        break;
      case "relevance":
      default:
        // Basic relevance: prioritize newer documents if no search term
        orderByClause = desc(documents.createdAt);
        // More complex relevance could be added if needed,
        // possibly involving full-text search capabilities if the DB supports it.
        // For now, fallback to date.
        break;
    }

    const results = await db
      .select({
        // Select all fields from documents
        id: documents.id,
        title: documents.title,
        description: documents.description,
        originalFilename: documents.originalFilename,
        storagePath: documents.storagePath,
        fileType: documents.fileType,
        fileSize: documents.fileSize,
        thumbnailStoragePath: documents.thumbnailStoragePath,
        published: documents.published,
        downloadCount: documents.downloadCount,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        categoryId: documents.categoryId,
        authorId: documents.authorId,
        // Select category details
        category: categories,
        // Select specific author details
        author: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(documents)
      .leftJoin(categories, eq(documents.categoryId, categories.id))
      .leftJoin(user, eq(documents.authorId, user.id)) // Join with user table
      .where(whereCondition) // Apply combined conditions
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    return results as DocumentWithDetails[];
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Không thể lấy danh sách tài liệu");
  }
}

/**
 * Get documents uploaded by a specific user
 */
export async function getUserDocuments(userId: string, limit = 50, offset = 0) {
  try {
    return await getDocuments({
      authorId: userId,
      limit,
      offset,
    });
  } catch (error) {
    console.error(`Error fetching documents for user ${userId}:`, error);
    throw new Error("Không thể lấy danh sách tài liệu của người dùng");
  }
}

/**
 * Get a single document by ID, including author details
 */
export async function getDocumentById(
  id: string
): Promise<DocumentWithDetails | null> {
  try {
    const result = await db
      .select({
        // Select all fields from documents
        id: documents.id,
        title: documents.title,
        description: documents.description,
        originalFilename: documents.originalFilename,
        storagePath: documents.storagePath,
        fileType: documents.fileType,
        fileSize: documents.fileSize,
        thumbnailStoragePath: documents.thumbnailStoragePath,
        published: documents.published,
        downloadCount: documents.downloadCount,
        viewCount: documents.viewCount,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        categoryId: documents.categoryId,
        authorId: documents.authorId,
        // Select category details
        category: categories,
        // Select specific author details
        author: {
          id: user.id,
          name: user.name,
          image: user.image,
        },
      })
      .from(documents)
      .where(eq(documents.id, id))
      .leftJoin(categories, eq(documents.categoryId, categories.id))
      .leftJoin(user, eq(documents.authorId, user.id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return result[0];
  } catch (error) {
    console.error(`Error fetching document with ID ${id}:`, error);
    throw new Error("Không thể lấy thông tin tài liệu");
  }
}

/**
 * Get unique file types stored in the documents table
 */
export async function getUniqueFileTypes(): Promise<string[]> {
  try {
    const results = await db
      .selectDistinct({ fileType: documents.fileType })
      .from(documents)
      .where(eq(documents.published, true)); // Optionally filter by published

    // Filter out null/empty values and return unique types
    return results
      .map((r) => r.fileType)
      .filter((ft): ft is string => ft !== null && ft !== "");
  } catch (error) {
    console.error("Error fetching unique file types:", error);
    throw new Error("Không thể lấy danh sách loại tệp");
  }
}

// ==========================================
// Category Queries
// ==========================================

/**
 * Get all categories
 */
export async function getCategories(params: CategoryQueryParams = {}) {
  const { search, page = 1, limit = 50 } = params;
  const offset = (page - 1) * limit;

  try {
    if (search) {
      // If there's a search term, filter by name (case-insensitive)
      const results = await db
        .select()
        .from(categories)
        .where(ilike(categories.name, `%${search}%`))
        .orderBy(categories.name)
        .limit(limit)
        .offset(offset);

      return results;
    } else {
      // No search, return all with pagination
      const results = await db
        .select()
        .from(categories)
        .orderBy(categories.name)
        .limit(limit)
        .offset(offset);

      return results;
    }
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Không thể lấy danh sách danh mục");
  }
}

/**
 * Get a category by ID
 */
export async function getCategoryById(id: string) {
  try {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw new Error("Không thể lấy thông tin danh mục");
  }
}

/**
 * Create a new category
 */
export async function createCategory(data: CreateCategoryData) {
  try {
    const result = await db.insert(categories).values(data).returning();

    if (!result || result.length === 0) {
      throw new Error("Danh mục không được tạo");
    }

    return result[0];
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error(
      `Không thể tạo danh mục: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Update a category by ID
 */
export async function updateCategory(id: string, data: UpdateCategoryData) {
  try {
    const result = await db
      .update(categories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(categories.id, id))
      .returning();

    if (!result || result.length === 0) {
      throw new Error("Danh mục không tồn tại hoặc không được cập nhật");
    }

    return result[0];
  } catch (error) {
    console.error(`Error updating category with ID ${id}:`, error);
    throw new Error(
      `Không thể cập nhật danh mục: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Delete a category by ID
 */
export async function deleteCategory(id: string) {
  try {
    const result = await db
      .delete(categories)
      .where(eq(categories.id, id))
      .returning();

    if (!result || result.length === 0) {
      throw new Error("Danh mục không tồn tại hoặc không được xóa");
    }

    return result[0];
  } catch (error) {
    console.error(`Error deleting category with ID ${id}:`, error);
    throw new Error(
      `Không thể xóa danh mục: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Get a category by slug
 */
export async function getCategoryBySlug(slug: string) {
  try {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error(`Error fetching category with slug ${slug}:`, error);
    throw new Error("Không thể lấy thông tin danh mục");
  }
}

// ==========================================
// Export all functions
// ==========================================

export async function getAllDocuments({
  search,
  category,
  page = 1,
  pageSize = 10,
}: {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}) {
  try {
    const offset = (page - 1) * pageSize;

    // Build where conditions
    const conditions = [];
    if (search) {
      conditions.push(like(documents.title, `%${search}%`));
    }
    if (category) {
      conditions.push(eq(documents.categoryId, category));
    }

    // Get total count
    const totalCount = await db
      .select({ count: documents.id })
      .from(documents)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .then((result) => result.length);

    // Get paginated documents with category
    const docs = await db
      .select({
        id: documents.id,
        title: documents.title,
        description: documents.description,
        category: {
          id: categories.id,
          name: categories.name,
          slug: categories.slug,
          description: categories.description,
          createdAt: categories.createdAt,
          updatedAt: categories.updatedAt,
        },
        published: documents.published,
        downloadCount: documents.downloadCount,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
      })
      .from(documents)
      .leftJoin(categories, eq(documents.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(documents.createdAt))
      .limit(pageSize)
      .offset(offset);

    return {
      documents: docs,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
    };
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw error;
  }
}
