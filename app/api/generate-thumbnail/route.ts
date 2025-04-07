import { auth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import filepreview from "filepreview";
import fs from "fs";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileUrl, fileName } = await req.json();

    // Tạo thư mục tạm nếu chưa tồn tại
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    // Tạo tên file tạm và đường dẫn cho thumbnail
    const tempFilePath = path.join(tmpDir, fileName);
    const thumbnailPath = path.join(
      tmpDir,
      `thumb-${path.parse(fileName).name}.jpg`
    );

    // Tải file về từ Supabase để xử lý
    const response = await fetch(fileUrl);
    const blob = await response.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync(tempFilePath, buffer);

    // Tạo thumbnail với filepreview
    const options = {
      width: 800,
      height: 600,
      quality: 100,
      density: 300,
      background: "#FFFFFF",
    };

    await new Promise<void>((resolve, reject) => {
      filepreview.generate(
        tempFilePath,
        thumbnailPath,
        options,
        (error: Error | null) => {
          if (error) {
            reject(error);
            return;
          }
          resolve();
        }
      );
    });

    // Upload thumbnail lên Supabase
    const supabase = await createClient();
    const thumbnailFile = fs.readFileSync(thumbnailPath);
    const uploadPath = `thumbnails/${uuidv4()}.jpg`;

    const { error } = await supabase.storage
      .from("documents")
      .upload(uploadPath, thumbnailFile, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      throw new Error(`Failed to upload thumbnail: ${error.message}`);
    }

    // Lấy public URL của thumbnail
    const { data: urlData } = supabase.storage
      .from("documents")
      .getPublicUrl(uploadPath);

    // Xóa các file tạm
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(thumbnailPath);

    return NextResponse.json({ thumbnailUrl: urlData.publicUrl });
  } catch (error) {
    console.error("Error generating thumbnail:", error);
    return NextResponse.json(
      { error: "Failed to generate thumbnail" },
      { status: 500 }
    );
  }
}
