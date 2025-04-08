import { auth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import filepreview from "filepreview";
import fsPromises from "fs/promises";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import os from "os";
import path from "path";

/**
 * Document: https://www.npmjs.com/package/filepreview?activeTab=readme
 */

export async function POST(req: Request) {
  const supabase = await createClient();

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { storagePath, thumbnailStoragePath, originalFilename } =
      await req.json();

    if (!storagePath || !thumbnailStoragePath || !originalFilename) {
      return NextResponse.json(
        {
          error:
            "Missing storagePath, thumbnailStoragePath, or originalFilename",
        },
        { status: 400 }
      );
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("documents")
      .download(storagePath);

    if (downloadError || !fileData) {
      console.error(
        "Error downloading original file from Supabase:",
        downloadError
      );
      throw new Error("Could not download original file from storage.");
    }

    const tmpDir = os.tmpdir();

    const tempInputPath = path.join(tmpDir, `input-${originalFilename}`);
    const tempOutputPath = path.join(
      tmpDir,
      `thumb-${path.parse(originalFilename).name}.jpg`
    );

    await fsPromises.writeFile(
      tempInputPath,
      Buffer.from(await fileData.arrayBuffer())
    );

    const options = {
      width: 800,
      height: 600,
      quality: 100,
      density: 300,
      background: "#FFFFFF",
    };

    await new Promise<void>((resolve, reject) => {
      filepreview.generate(
        tempInputPath,
        tempOutputPath,
        options,
        (error: Error | null) => {
          if (error) {
            console.error("filepreview generation error:", error);
            reject(error);
            return;
          }
          resolve();
        }
      );
    });

    const thumbnailFileBuffer = await fsPromises.readFile(tempOutputPath);

    const { error: uploadError } = await supabase.storage
      .from("thumbnails")
      .upload(thumbnailStoragePath, thumbnailFileBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    await fsPromises
      .unlink(tempInputPath)
      .catch((err) => console.error("Error deleting temp input file:", err));
    await fsPromises
      .unlink(tempOutputPath)
      .catch((err) => console.error("Error deleting temp output file:", err));

    if (uploadError) {
      console.error("Error uploading thumbnail to Supabase:", uploadError);
      throw new Error(`Failed to upload thumbnail: ${uploadError.message}`);
    }

    return NextResponse.json({ thumbnailStoragePath });
  } catch (error) {
    console.error("Error in POST /api/generate-thumbnail:", error);
    return NextResponse.json(
      {
        error: "Failed to generate thumbnail",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
