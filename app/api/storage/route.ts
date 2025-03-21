import { DOCUMENTS_BUCKET, supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const path = searchParams.get("path");

  if (!path) {
    return NextResponse.json(
      { error: "Path parameter is required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .createSignedUrl(path, 60 * 60); // 1 hour expiry

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (error) {
    console.error("Error creating signed URL:", error);
    return NextResponse.json(
      { error: "Failed to get file URL" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { path } = await request.json();

    if (!path) {
      return NextResponse.json(
        { error: "Path parameter is required" },
        { status: 400 }
      );
    }

    const { data } = await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .getPublicUrl(path);

    return NextResponse.json({ url: data.publicUrl });
  } catch (error) {
    console.error("Error getting public URL:", error);
    return NextResponse.json(
      { error: "Failed to get public URL" },
      { status: 500 }
    );
  }
}
