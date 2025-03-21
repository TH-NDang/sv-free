import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Lấy thông tin tài liệu từ các tham số URL
    const title = searchParams.get("title") || "Tài liệu";
    const category = searchParams.get("category") || "Danh mục";
    const author = searchParams.get("author") || "SVFree";

    // Đảm bảo font được tải
    const interSemiBold = fetch(
      new URL(
        "https://fonts.googleapis.com/css2?family=Inter:wght@600&display=swap"
      )
    ).then((res) => res.arrayBuffer());

    return new ImageResponse(
      (
        <div
          style={{
            background: "linear-gradient(125deg, #4b6cb7 0%, #182848 100%)",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              padding: "20px 50px",
            }}
          >
            <p
              style={{
                fontSize: 28,
                opacity: 0.9,
                color: "white",
                marginBottom: 10,
              }}
            >
              {siteConfig.name} | {category}
            </p>

            <h1
              style={{
                fontSize: 56,
                fontWeight: "bold",
                color: "white",
                textAlign: "center",
                marginBottom: 20,
                maxWidth: 900,
              }}
            >
              {title}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto",
                marginTop: 40,
                padding: "8px 16px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: 8,
              }}
            >
              <p style={{ color: "white", fontSize: 20, margin: 0 }}>
                Được chia sẻ bởi: {author}
              </p>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "Inter",
            data: await interSemiBold,
            style: "normal",
            weight: 600,
          },
        ],
      }
    );
  } catch {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
