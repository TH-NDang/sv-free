import { getUniqueFileTypes } from "@/lib/db/queries"; // Assuming correct path
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const fileTypes = await getUniqueFileTypes();
    return NextResponse.json(fileTypes);
  } catch (error) {
    console.error("Error fetching unique file types:", error);
    return NextResponse.json(
      { error: "Failed to fetch unique file types" },
      { status: 500 }
    );
  }
}
