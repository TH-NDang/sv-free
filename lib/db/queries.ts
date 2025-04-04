import { db } from "@/lib/db";
import { categories, documents } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

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

// ==========================================
// Document Queries
// ==========================================

/**
 * Create a new document
 */
export async function createDocument(data: CreateDocumentData) {
  try {
    console.log("Creating document with data:", data);

    // Prepare document data with defaults for optional fields
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
  limit = 10,
  offset = 0,
}: DocumentQueryParams = {}) {
  try {
    let query;

    if (categoryId) {
      // Nếu có categoryId, thêm điều kiện where ngay từ đầu
      query = db
        .select({
          document: documents,
          category: categories,
        })
        .from(documents)
        .where(eq(documents.categoryId, categoryId))
        .leftJoin(categories, eq(documents.categoryId, categories.id))
        .orderBy(desc(documents.createdAt))
        .limit(limit)
        .offset(offset);
    } else {
      // Nếu không có điều kiện lọc
      query = db
        .select({
          document: documents,
          category: categories,
        })
        .from(documents)
        .leftJoin(categories, eq(documents.categoryId, categories.id))
        .orderBy(desc(documents.createdAt))
        .limit(limit)
        .offset(offset);
    }

    const results = await query;

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
export async function getCategories() {
  try {
    return await db.select().from(categories).orderBy(categories.name);
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
