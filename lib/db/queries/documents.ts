import { db } from "@/lib/db";
import {
  categories,
  documents,
  documentTags,
  tags,
} from "@/lib/db/schema/document-schema";
import { and, count, desc, eq, like } from "drizzle-orm";

export type DocumentQueryParams = {
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  searchTerm?: string;
  publishedOnly?: boolean;
  limit?: number;
  offset?: number;
};

export async function getDocuments({
  categoryId,
  tagId,
  authorId,
  searchTerm,
  publishedOnly = true,
  limit = 10,
  offset = 0,
}: DocumentQueryParams = {}) {
  try {
    // Build all filter conditions
    const conditions = [];

    if (categoryId) {
      conditions.push(eq(documents.categoryId, categoryId));
    }

    if (authorId) {
      conditions.push(eq(documents.authorId, authorId));
    }

    if (publishedOnly) {
      conditions.push(eq(documents.published, true));
    }

    if (searchTerm) {
      conditions.push(like(documents.title, `%${searchTerm}%`));
    }

    // Handle tag filtering
    let query;

    if (tagId) {
      // For tag filtering, we need to join with documentTags
      if (conditions.length > 0) {
        // Combine tag condition with other conditions
        query = db
          .select({
            document: documents,
            category: categories,
          })
          .from(documents)
          .leftJoin(categories, eq(documents.categoryId, categories.id))
          .innerJoin(documentTags, eq(documents.id, documentTags.documentId))
          .where(and(eq(documentTags.tagId, tagId), ...conditions))
          .orderBy(desc(documents.createdAt))
          .limit(limit)
          .offset(offset);
      } else {
        // Only tag condition
        query = db
          .select({
            document: documents,
            category: categories,
          })
          .from(documents)
          .leftJoin(categories, eq(documents.categoryId, categories.id))
          .innerJoin(documentTags, eq(documents.id, documentTags.documentId))
          .where(eq(documentTags.tagId, tagId))
          .orderBy(desc(documents.createdAt))
          .limit(limit)
          .offset(offset);
      }
    } else if (conditions.length > 0) {
      // No tag filtering, only other conditions
      query = db
        .select({
          document: documents,
          category: categories,
        })
        .from(documents)
        .leftJoin(categories, eq(documents.categoryId, categories.id))
        .where(and(...conditions))
        .orderBy(desc(documents.createdAt))
        .limit(limit)
        .offset(offset);
    } else {
      // No filtering at all
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
    throw new Error("Failed to fetch documents");
  }
}

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

    const documentTags = await getDocumentTags(id);

    return {
      ...result[0].document,
      category: result[0].category,
      tags: documentTags,
    };
  } catch (error) {
    console.error(`Error fetching document with ID ${id}:`, error);
    throw new Error("Failed to fetch document");
  }
}

export async function getDocumentTags(documentId: string) {
  try {
    const result = await db
      .select({
        tag: tags,
      })
      .from(documentTags)
      .innerJoin(tags, eq(documentTags.tagId, tags.id))
      .where(eq(documentTags.documentId, documentId));

    return result.map(({ tag }) => tag);
  } catch (error) {
    console.error(`Error fetching tags for document ${documentId}:`, error);
    throw new Error("Failed to fetch document tags");
  }
}

export async function getDocumentCount(params: DocumentQueryParams = {}) {
  try {
    const {
      categoryId,
      tagId,
      authorId,
      searchTerm,
      publishedOnly = true,
    } = params;

    const conditions = [];

    if (categoryId) {
      conditions.push(eq(documents.categoryId, categoryId));
    }

    if (authorId) {
      conditions.push(eq(documents.authorId, authorId));
    }

    if (publishedOnly) {
      conditions.push(eq(documents.published, true));
    }

    if (searchTerm) {
      conditions.push(like(documents.title, `%${searchTerm}%`));
    }

    let query;

    if (tagId) {
      // For tag filtering with other conditions
      if (conditions.length > 0) {
        query = db
          .select({ count: count() })
          .from(documents)
          .innerJoin(documentTags, eq(documents.id, documentTags.documentId))
          .where(and(eq(documentTags.tagId, tagId), ...conditions));
      } else {
        // Only tag condition
        query = db
          .select({ count: count() })
          .from(documents)
          .innerJoin(documentTags, eq(documents.id, documentTags.documentId))
          .where(eq(documentTags.tagId, tagId));
      }
    } else if (conditions.length > 0) {
      // No tag filtering, only other conditions
      query = db
        .select({ count: count() })
        .from(documents)
        .where(and(...conditions));
    } else {
      // No filtering at all
      query = db.select({ count: count() }).from(documents);
    }

    const result = await query;
    return result[0]?.count || 0;
  } catch (error) {
    console.error("Error counting documents:", error);
    throw new Error("Failed to count documents");
  }
}
