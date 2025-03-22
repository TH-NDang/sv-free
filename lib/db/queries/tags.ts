import { db } from "@/lib/db";
import { documentTags, tags } from "@/lib/db/schema/document-schema";
import { count, eq } from "drizzle-orm";

export async function getTags() {
  try {
    const result = await db
      .select({
        tag: tags,
        documentCount: count(documentTags.documentId).as("documentCount"),
      })
      .from(tags)
      .leftJoin(documentTags, eq(tags.id, documentTags.tagId))
      .groupBy(tags.id)
      .orderBy(tags.name);

    return result.map(({ tag, documentCount }) => ({
      ...tag,
      documentCount,
    }));
  } catch (error) {
    console.error("Error fetching tags:", error);
    throw new Error("Failed to fetch tags");
  }
}

export async function getTagById(id: string) {
  try {
    const result = await db
      .select({
        tag: tags,
        documentCount: count(documentTags.documentId).as("documentCount"),
      })
      .from(tags)
      .where(eq(tags.id, id))
      .leftJoin(documentTags, eq(tags.id, documentTags.tagId))
      .groupBy(tags.id)
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return {
      ...result[0].tag,
      documentCount: result[0].documentCount,
    };
  } catch (error) {
    console.error(`Error fetching tag with ID ${id}:`, error);
    throw new Error("Failed to fetch tag");
  }
}

export async function getTagBySlug(slug: string) {
  try {
    const result = await db
      .select({
        tag: tags,
        documentCount: count(documentTags.documentId).as("documentCount"),
      })
      .from(tags)
      .where(eq(tags.slug, slug))
      .leftJoin(documentTags, eq(tags.id, documentTags.tagId))
      .groupBy(tags.id)
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return {
      ...result[0].tag,
      documentCount: result[0].documentCount,
    };
  } catch (error) {
    console.error(`Error fetching tag with slug ${slug}:`, error);
    throw new Error("Failed to fetch tag");
  }
}
