import { InferInsertModel, InferSelectModel, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";

// ==========================================
// Auth Schema
// Warning: This schema is automatically generated by Better Auth.
// Table name is use default, only add fields you need to add.
// Docs: https://better-auth.vercel.app/docs/concepts/database
//      https://better-auth.vercel.app/docs/plugins/admin#roles
// ==========================================

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
});

export type User = InferSelectModel<typeof user>;

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// ==========================================
// Document Schema
// ==========================================

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  originalFilename: text("original_filename").notNull(),
  storagePath: text("storage_path").notNull().unique(),
  fileType: varchar("file_type", { length: 100 }),
  fileSize: bigint("file_size", { mode: "number" }), //kích thước KB
  thumbnailStoragePath: text("thumbnail_storage_path").unique(),
  categoryId: uuid("category_id").references(() => categories.id),
  authorId: text("author_id").references(() => user.id),
  published: boolean("published").default(true).notNull(),
  downloadCount: integer("download_count").default(0).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Document = InferSelectModel<typeof documents>;
export type NewDocument = InferInsertModel<typeof documents>;

export const documentDownloads = pgTable("document_downloads", {
  id: uuid("id").defaultRandom().primaryKey(),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  downloadDate: timestamp("download_date").defaultNow().notNull(),
});

export type DocumentDownload = InferSelectModel<typeof documentDownloads>;
export type NewDocumentDownload = InferInsertModel<typeof documentDownloads>;

export const savedDocuments = pgTable("saved_documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});

export type SavedDocument = InferSelectModel<typeof savedDocuments>;
export type NewSavedDocument = InferInsertModel<typeof savedDocuments>;

export const documentSchema = z.object({
  title: z
    .string()
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(255, "Tiêu đề không được vượt quá 255 ký tự"),
  description: z.string().optional().nullable(),
  originalFilename: z.string().min(1, "Tên file gốc không được để trống"),
  storagePath: z.string().min(1, "Đường dẫn lưu trữ không được để trống"),
  thumbnailStoragePath: z.string().optional().nullable(),
  fileType: z.string().optional().nullable(),
  fileSize: z
    .number()
    .positive("Kích thước file phải là số dương")
    .optional()
    .nullable(),
  categoryId: z.string().uuid("ID danh mục không hợp lệ").optional().nullable(),
  published: z.boolean().optional().default(true),
});

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const documentTags = pgTable("document_tags", {
  documentId: uuid("document_id")
    .notNull()
    .references(() => documents.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
});

export const reviews = pgTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    documentId: uuid("document_id")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    userName: text("user_name").notNull(), // Tên người dùng (có thể là tên thật hoặc tên hiển thị)
    userImage: text("user_image"), // Hình ảnh người dùng (có thể là URL hoặc đường dẫn đến hình ảnh)
    comment: text("comment").default(sql`NULL`), // Nội dung bình luận (có thể null nếu chỉ là đánh giá)
    rating: integer("rating"), // Đảm bảo rating nằm trong khoảng 1-5 hoặc null
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(), // Thêm cột updatedAt để theo dõi cập nhật
  },
  () => [
    sql`CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5))`, // Đảm bảo rating nằm trong khoảng 1-5 hoặc null
  ]
);

export type Review = InferSelectModel<typeof reviews>;
export type NewReview = InferInsertModel<typeof reviews>;
