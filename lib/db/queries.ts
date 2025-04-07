import { db } from "@/lib/db";
import { categories, documents } from "@/lib/db/schema";
import { desc, eq, like, SQL } from "drizzle-orm";

// ==========================================
// Document Types
// ==========================================

/**
 * Type for document creation
 */
export interface CreateDocumentData {
  title: string;
  description?: string | null;
  fileUrl: string;
  fileType?: string | null;
  fileSize?: string | null;
  categoryId?: string | null;
  authorId?: string | null;
  thumbnailUrl?: string | null;
  published?: boolean;
}

/**
 * Type for document query parameters
 */
export type DocumentQueryParams = {
  categoryId?: string;
  authorId?: string;
  limit?: number;
  offset?: number;
};

// ==========================================
// Category Types
// ==========================================

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
export async function createDocument(data: CreateDocumentData) {
  try {
    const documentData = {
      title: data.title,
      description: data.description || null,
      fileUrl: data.fileUrl,
      fileType: data.fileType || null,
      fileSize: data.fileSize || null,
      categoryId: data.categoryId || null,
      authorId: data.authorId || null,
      thumbnailUrl: data.thumbnailUrl || null,
      published: data.published !== undefined ? data.published : true,
      downloadCount: "0",
    };

    const result = await db.insert(documents).values(documentData).returning();

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
 * Get documents with basic filtering
 */
export async function getDocuments({
  categoryId,
  authorId,
  limit = 10,
  offset = 0,
}: DocumentQueryParams = {}) {
  try {
    // Build conditions for SQL
    const conditions: SQL[] = [];

    if (categoryId) {
      conditions.push(eq(documents.categoryId, categoryId));
    }

    if (authorId) {
      conditions.push(eq(documents.authorId, authorId));
    }

    // Execute query with or without conditions
    let results;

    if (conditions.length === 0) {
      // No conditions
      results = await db
        .select({
          document: documents,
          category: categories,
        })
        .from(documents)
        .leftJoin(categories, eq(documents.categoryId, categories.id))
        .orderBy(desc(documents.createdAt))
        .limit(limit)
        .offset(offset);
    } else if (conditions.length === 1) {
      // One condition
      results = await db
        .select({
          document: documents,
          category: categories,
        })
        .from(documents)
        .where(conditions[0])
        .leftJoin(categories, eq(documents.categoryId, categories.id))
        .orderBy(desc(documents.createdAt))
        .limit(limit)
        .offset(offset);
    } else {
      // Multiple conditions - this would need to be handled differently
      // For simplicity, we'll use the first condition as a temporary solution
      results = await db
        .select({
          document: documents,
          category: categories,
        })
        .from(documents)
        .where(conditions[0])
        .leftJoin(categories, eq(documents.categoryId, categories.id))
        .orderBy(desc(documents.createdAt))
        .limit(limit)
        .offset(offset);
    }

    return results.map(({ document, category }) => ({
      ...document,
      category,
    }));
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
 * Get a single document by ID
 */
export async function getDocumentById(id: string) {
  try {
    const result = await db
      .select({
        document: documents,
        category: categories,
      })
      .from(documents)
      .where(eq(documents.id, id))
      .leftJoin(categories, eq(documents.categoryId, categories.id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return {
      ...result[0].document,
      category: result[0].category,
    };
  } catch (error) {
    console.error(`Error fetching document with ID ${id}:`, error);
    throw new Error("Không thể lấy thông tin tài liệu");
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
      // If there's a search term, filter by name
      const results = await db
        .select()
        .from(categories)
        .where(like(categories.name, `%${search}%`))
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
