// app/api/user/route.ts
// import { getAllUsers } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // const users = await getAllUsers();
    // return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
