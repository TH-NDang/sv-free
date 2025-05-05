import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { url, options } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const headers = new Headers(request.headers);
    headers.delete("host");

    let response: Response;
    try {
      response = await fetch(url, {
        method: options.method || "POST",
        headers: options.headers || headers,
        body:
          options.body instanceof FormData
            ? options.body
            : JSON.stringify(options.body),
      });
    } catch (error) {
      console.error("Error in proxy fetch:", error);
      return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }

    return response;
  } catch (error) {
    console.error("Error in proxy fetch:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
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

    const headers = new Headers(request.headers);

    headers.delete("host");

    const response = await fetch(url, { headers });
    return response;
  } catch {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
