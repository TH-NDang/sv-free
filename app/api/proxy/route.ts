import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url, options } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Tạo headers mới với Origin và Referer để giúp vượt qua một số kiểm tra CORS
    const headers = new Headers(options?.headers || {});

    // Chỉ thêm các headers này nếu chưa tồn tại
    if (!headers.has("Origin")) {
      headers.set("Origin", new URL(url).origin);
    }

    if (!headers.has("Referer")) {
      headers.set("Referer", new URL(url).origin);
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    let data;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      data,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL is required as a query parameter" },
        { status: 400 }
      );
    }

    // Tạo headers với Origin và Referer để hỗ trợ vượt qua một số kiểm tra CORS
    const headers = new Headers();
    headers.set("Origin", new URL(url).origin);
    headers.set("Referer", new URL(url).origin);

    const response = await fetch(url, { headers });

    let data;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return NextResponse.json({
      status: response.status,
      statusText: response.statusText,
      data,
      headers: Object.fromEntries(response.headers.entries()),
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to proxy request", message: (error as Error).message },
      { status: 500 }
    );
  }
}
