// Đảm bảo nạp biến môi trường từ .env trước khi import các module khác
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { v4 as uuidv4 } from "uuid";
import { categories } from "./schema";

// ==========================================
// Thiết lập kết nối database riêng cho seed
// ==========================================
config({
  path: ".env",
});

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL không được định nghĩa trong biến môi trường. Vui lòng kiểm tra file .env"
  );
}

const client = postgres(DATABASE_URL);
const db = drizzle(client);

/**
 * Danh sách danh mục cố định để seed
 */
const CATEGORIES = [
  {
    id: uuidv4(),
    name: "Công nghệ thông tin",
    slug: "cong-nghe-thong-tin",
    description: "Tài liệu về lập trình, phát triển phần mềm, công nghệ mới",
  },
  {
    id: uuidv4(),
    name: "Kinh tế",
    slug: "kinh-te",
    description: "Tài liệu về kinh tế, tài chính, kinh doanh, marketing",
  },
  {
    id: uuidv4(),
    name: "Kỹ thuật",
    slug: "ky-thuat",
    description: "Tài liệu về điện tử, cơ khí, xây dựng và các ngành kỹ thuật",
  },
  {
    id: uuidv4(),
    name: "Khoa học tự nhiên",
    slug: "khoa-hoc-tu-nhien",
    description:
      "Toán học, Vật lý, Hóa học, Sinh học và các ngành khoa học tự nhiên",
  },
  {
    id: uuidv4(),
    name: "Khoa học xã hội",
    slug: "khoa-hoc-xa-hoi",
    description:
      "Tâm lý học, Lịch sử, Văn học, Ngôn ngữ và các ngành khoa học xã hội",
  },
  {
    id: uuidv4(),
    name: "Y học",
    slug: "y-hoc",
    description: "Tài liệu về y học, dược phẩm, sức khỏe và y tế",
  },
  {
    id: uuidv4(),
    name: "Nông nghiệp",
    slug: "nong-nghiep",
    description: "Tài liệu về nông nghiệp, chăn nuôi, trồng trọt, thủy sản",
  },
  {
    id: uuidv4(),
    name: "Giáo dục",
    slug: "giao-duc",
    description: "Tài liệu về giáo dục, đào tạo, phương pháp giảng dạy",
  },
  {
    id: uuidv4(),
    name: "Luật",
    slug: "luat",
    description: "Tài liệu về luật, pháp luật, quy định pháp lý",
  },
];

/**
 * Thêm dữ liệu danh mục vào database
 */
export async function seedCategories() {
  console.log("🌱 Seeding categories...");

  try {
    // Kiểm tra xem đã có categories chưa
    const existingCategories = await db.select().from(categories);

    if (existingCategories.length > 0) {
      console.log(
        `Found ${existingCategories.length} existing categories. Skipping seed.`
      );
      return existingCategories;
    }

    // Thêm dữ liệu vào bảng categories
    const result = await db.insert(categories).values(CATEGORIES).returning();

    console.log(`✅ Successfully seeded ${result.length} categories`);
    return result;
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    throw error;
  }
}

async function main() {
  try {
    console.log("🔍 Kiểm tra kết nối database...");

    await seedCategories();
    console.log("🎉 Seed completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed:", error);
  } finally {
    // Đóng kết nối trước khi thoát
    await client.end();
    process.exit(0);
  }
}

// Chạy seed nếu file được gọi trực tiếp (không phải import)
if (require.main === module) {
  main();
}
