import { db } from "@/lib/db";
import { categories, documents } from "@/lib/db/schema/document-schema";
import { count, eq } from "drizzle-orm";

export async function getCategories() {
  try {
    const result = await db
      .select({
        category: categories,
        documentCount: count(documents.id).as("documentCount"),
      })
      .from(categories)
      .leftJoin(documents, eq(categories.id, documents.categoryId))
      .groupBy(categories.id)
      .orderBy(categories.name);

    return result.map(({ category, documentCount }) => ({
      ...category,
      documentCount,
    }));
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw new Error("Failed to fetch categories");
  }
}

export async function getCategoryById(id: string) {
  try {
    const result = await db
      .select({
        category: categories,
        documentCount: count(documents.id).as("documentCount"),
      })
      .from(categories)
      .where(eq(categories.id, id))
      .leftJoin(documents, eq(categories.id, documents.categoryId))
      .groupBy(categories.id)
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return {
      ...result[0].category,
      documentCount: result[0].documentCount,
    };
  } catch (error) {
    console.error(`Error fetching category with ID ${id}:`, error);
    throw new Error("Failed to fetch category");
  }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const result = await db
      .select({
        category: categories,
        documentCount: count(documents.id).as("documentCount"),
      })
      .from(categories)
      .where(eq(categories.slug, slug))
      .leftJoin(documents, eq(categories.id, documents.categoryId))
      .groupBy(categories.id)
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return {
      ...result[0].category,
      documentCount: result[0].documentCount,
    };
  } catch (error) {
    console.error(`Error fetching category with slug ${slug}:`, error);
    throw new Error("Failed to fetch category");
  }
}
