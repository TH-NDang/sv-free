import { deleteUser, getUserById, updateUser } from "@/lib/db/new_queries";
import { NextResponse } from "next/server";

// GET /api/user/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userData = await getUserById(params.id);
    if (!userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(userData);
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PUT /api/user/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    const userId = (await params).id;

    // Convert date strings to Date objects
    const processedBody = {
      ...body,
      banExpires: body.banExpires ? new Date(body.banExpires) : undefined,
      updatedAt: new Date(),
    };

    const updatedUser = await updateUser(userId, processedBody);

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Không tìm thấy người dùng" },
        { status: 404 }
      );
    }

    // Kiểm tra và chuyển đổi dates thành ISO strings
    const responseUser = {
      ...updatedUser,
      banExpires:
        updatedUser.banExpires instanceof Date
          ? updatedUser.banExpires.toISOString()
          : null,
      createdAt:
        updatedUser.createdAt instanceof Date
          ? updatedUser.createdAt.toISOString()
          : new Date(updatedUser.createdAt).toISOString(),
      updatedAt:
        updatedUser.updatedAt instanceof Date
          ? updatedUser.updatedAt.toISOString()
          : new Date(updatedUser.updatedAt).toISOString(),
    };

    return NextResponse.json(responseUser);
  } catch (error) {
    console.error("Lỗi khi cập nhật người dùng:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật người dùng" },
      { status: 500 }
    );
  }
}

// DELETE /api/user/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = (await params).id;
    const deletedUser = await deleteUser(userId);
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(deletedUser);
  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
