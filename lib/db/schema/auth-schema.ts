import { pgTable, text, timestamp, boolean, unique } from "drizzle-orm/pg-core";
import { categories } from "./document-schema";

// Bảng users
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(), // Mật khẩu mã hóa
  fullName: text("full_name"),
  role: text("role")
    .default("student")
    .$type<"student" | "teacher" | "admin">(), // Thay pgEnum bằng text
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  banned: boolean("banned").default(false), // Cấm người dùng
  banReason: text("ban_reason"), // Lý do cấm
  banExpires: timestamp("ban_expires"), // Thời gian hết cấm
});

// Bảng resources
export const resources = pgTable("resources", {
  id: text("id").primaryKey(),
  title: text("title").notNull(), // Tiêu đề tài liệu
  description: text("description"), // Mô tả tài liệu
  fileUrl: text("file_url").notNull(), // Đường dẫn tới file
  categoryId: text("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }), // Liên kết với danh mục
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Người tải lên
  uploadDate: timestamp("upload_date").notNull().defaultNow(),
});

// Bảng comments
export const comments = pgTable("comments", {
  id: text("id").primaryKey(),
  resourceId: text("resource_id")
    .notNull()
    .references(() => resources.id, { onDelete: "cascade" }), // Liên kết với tài liệu
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // Người bình luận
  content: text("content").notNull(), // Nội dung bình luận
  commentDate: timestamp("comment_date").notNull().defaultNow(),
});

// Bảng ratings
export const ratings = pgTable(
  "ratings",
  {
    id: text("id").primaryKey(),
    resourceId: text("resource_id")
      .notNull()
      .references(() => resources.id, { onDelete: "cascade" }), // Tài liệu được đánh giá
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }), // Người đánh giá
    rating: text("rating").notNull().$type<"1" | "2" | "3" | "4" | "5">(), // Đánh giá từ 1-5
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    uniqueRating: unique("unique_rating").on(table.resourceId, table.userId), // Mỗi người chỉ đánh giá 1 lần
  })
);

// Bảng session
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
});

// Bảng account
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Bảng verification
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
