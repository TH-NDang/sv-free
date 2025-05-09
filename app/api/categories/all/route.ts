import { getAllCategoriesWithoutPagination } from "@/lib/db/new_queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const categories = await getAllCategoriesWithoutPagination();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
