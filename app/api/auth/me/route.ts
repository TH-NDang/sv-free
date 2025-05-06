import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers(),
      });
  if (!session?.user) {
    return NextResponse.json({ error: "Người dùng chưa đăng nhập" }, { status: 401 });
  }
  return NextResponse.json({ user: session.user });
}