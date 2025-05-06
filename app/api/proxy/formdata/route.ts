import { NextRequest, NextResponse } from "next/server";

/**
 * A specialized proxy endpoint that handles FormData requests
 * This route expects the target URL as a query parameter
 */
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");

    if (!url) {
      return NextResponse.json(
        { error: "URL is required as a query parameter" },
        { status: 400 }
      );
    }

    const headers = new Headers();
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "host") {
        headers.append(key, value);
      }
    });

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: request.body,
      // @ts-expect-error Error in form data proxy: TypeError: RequestInit: duplex option is required when sending a body.
      duplex: "half", // Required when sending a body that's a readable stream
    });

    return response;
  } catch (error) {
    console.error("Error in form data proxy:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
