// app/api/user/route.ts
import { createUser, getAllUsers } from "@/lib/db/new_queries";
import { NextResponse } from "next/server";

// GET /api/user
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Lấy các tham số phân trang từ query string
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const sortBy =
      (searchParams.get("sortBy") as "name" | "email" | "role" | "createdAt") ||
      "createdAt";
    const sortOrder =
      (searchParams.get("sortOrder") as "asc" | "desc") || "desc";

    // Validate các tham số
    if (page < 1) {
      return NextResponse.json(
        { error: "Page number must be greater than 0" },
        { status: 400 }
      );
    }

    if (pageSize < 1 || pageSize > 100) {
      return NextResponse.json(
        { error: "Page size must be between 1 and 100" },
        { status: 400 }
      );
    }

    const result = await getAllUsers({
      page,
      pageSize,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// POST /api/user
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }
    console.log("body", body);
    const newUser = await createUser(body);
    return NextResponse.json(newUser);
  } catch (error) {
    console.error("Failed to create user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
